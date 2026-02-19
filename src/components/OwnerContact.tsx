'use client';

import React from 'react';
import { buildPropertyMessage, buildWhatsAppUrl } from '@/lib/whatsapp';

interface OwnerContactProps {
  name: string;
  phone?: string;
  propertyTitle?: string;
  propertyPrice?: string;
  propertyLocation?: string;
  propertyId?: string;
}

export default function OwnerContact({ name, phone, propertyTitle, propertyPrice, propertyLocation, propertyId }: OwnerContactProps) {
  const whatsappHref = phone && propertyId
    ? buildWhatsAppUrl(phone, buildPropertyMessage({
        recipientName: name,
        propertyTitle: propertyTitle || 'this property',
        price: propertyPrice || '',
        location: propertyLocation || '',
        propertyId,
      }))
    : phone ? `https://wa.me/${phone.replace(/[^0-9]/g, '')}` : '';

  return (
    <div className="flex items-center gap-3 py-4 border-t border-gray-200 mt-6">
      {/* Gray placeholder avatar */}
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>

      {/* Owner info - de-emphasized */}
      <div>
        <p className="text-sm text-gray-500">Listed by</p>
        <p className="text-sm font-medium text-gray-700">{name}</p>
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            {phone}
          </a>
        )}
      </div>
    </div>
  );
}
