// src/components/PrivateListingDisclaimer.tsx

import Link from 'next/link';

interface PrivateListingDisclaimerProps {
  listedByType?: string;  // 'owner' | 'agent' | 'landlord'
  listingType?: 'sale' | 'rent';
}

export function PrivateListingDisclaimer({ listedByType }: PrivateListingDisclaimerProps) {
  const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Guyana Home Hub';

  // Only show for private listings (fsbo, owner, landlord) — not agents
  if (!listedByType || !['fsbo', 'owner', 'landlord'].includes(listedByType)) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4">
      <div className="flex items-start gap-3">
        {/* Warning Icon */}
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div className="flex-1">
          <h4 className="font-semibold text-amber-800 mb-1">
            Private Listing
          </h4>

          <p className="text-sm text-amber-700 mb-2">
            This property is listed directly by the owner. {SITE_NAME} has not verified ownership or the accuracy of this listing. For added protection, consider working with a verified agent.
          </p>

          <p className="text-sm text-amber-700 mb-3">
            <strong>Please exercise caution:</strong> Conduct your own due diligence before making any payments or signing agreements.
          </p>

          <Link
            href="/safety-tips"
            className="inline-flex items-center text-sm font-medium text-amber-800 hover:text-amber-900 underline"
          >
            View Safety Tips
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PrivateListingDisclaimer;