'use client';

import React from 'react';

// Helper function to format phone for WhatsApp
function formatWhatsAppNumber(phone: string, countryCode: string = '592'): string {
  // Remove all non-digits
  const digits = phone.replace(/[^0-9]/g, '');

  // If already has country code (10+ digits starting with country code), use as-is
  if (digits.length >= 10 && digits.startsWith(countryCode)) {
    return digits;
  }

  // If starts with +, remove it and check again
  if (phone.startsWith('+')) {
    return digits;
  }

  // Local number (7 digits or less for Guyana) - prepend country code
  if (digits.length <= 7) {
    return countryCode + digits;
  }

  // Otherwise return as-is
  return digits;
}

interface PromotedAgent {
  id: string;
  first_name: string;
  last_name: string;
  company?: string;
  phone?: string;
  profile_image?: string;
  is_verified_agent?: boolean;
}

interface OwnerContact {
  name: string;
  phone?: string;
}

interface PrivateListingContactProps {
  owner: OwnerContact;
  agent: PromotedAgent | null;
  onRequestViewing?: () => void;
}

export default function PrivateListingContact({
  owner,
  agent,
  onRequestViewing
}: PrivateListingContactProps) {
  const ownerWhatsapp = owner.phone ? formatWhatsAppNumber(owner.phone, '592') : '';
  const agentWhatsapp = agent?.phone ? formatWhatsAppNumber(agent.phone, '592') : '';

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* LEFT: Property Owner */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Property Owner</p>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">{owner.name}</p>
            {owner.phone && (
              <a
                href={`tel:${owner.phone}`}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                {owner.phone}
              </a>
            )}
          </div>
        </div>

        {ownerWhatsapp && (
          <a
            href={`https://wa.me/${ownerWhatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp Owner
          </a>
        )}
      </div>

      {/* RIGHT: Verified Agent */}
      {agent && (
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Verified Agent</p>

          <div className="flex items-center gap-3 mb-4">
            <img
              src={agent.profile_image || '/default-avatar.png'}
              alt={agent.first_name}
              className="w-12 h-12 rounded-full object-cover bg-gray-200 flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-avatar.png';
              }}
            />
            <div>
              <p className="text-base font-semibold text-gray-900">
                {agent.first_name} {agent.last_name}
              </p>
              {agent.is_verified_agent && (
                <span className="text-sm text-green-600">✓ Verified Agent</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {agentWhatsapp && (
              <a
                href={`https://wa.me/${agentWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contact via WhatsApp
              </a>
            )}

            <button
              onClick={onRequestViewing}
              className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Request Viewing
            </button>
          </div>
        </div>
      )}

      {/* If no agent, show agent directory link */}
      {!agent && (
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
          <p className="text-sm text-gray-500 text-center">
            Need help? Check our <a href="/agents" className="text-blue-600 hover:underline">Agent Directory</a>
          </p>
        </div>
      )}
    </div>
  );
}
