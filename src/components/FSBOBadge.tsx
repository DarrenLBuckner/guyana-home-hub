// FSBO Badge - Separate from status ribbon, shows "For Sale By Owner"
// src/components/FSBOBadge.tsx

'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface FSBOBadgeProps {
  listedByType?: string
  className?: string
}

export function FSBOBadge({ listedByType, className }: FSBOBadgeProps) {
  // Only show for owner-listed properties
  if (listedByType !== 'owner' && listedByType !== 'fsbo') return null

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 border border-orange-300 rounded-full",
      className
    )}>
      For Sale By Owner
    </span>
  )
}

// Alternative badge styles (can be used if different styling is preferred)
export function FSBOBadgeSimple({ listedByType, className }: FSBOBadgeProps) {
  if (listedByType !== 'owner' && listedByType !== 'fsbo') return null

  return (
    <span className={cn(
      "inline-block bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide",
      className
    )}>
      FSBO
    </span>
  )
}

// Badge for property cards with icon
export function FSBOBadgeWithIcon({ listedByType, className }: FSBOBadgeProps) {
  if (listedByType !== 'owner' && listedByType !== 'fsbo') return null

  return (
    <div className={cn(
      "inline-flex items-center gap-1 bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full border border-orange-200",
      className
    )}>
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
      <span>Owner Listed</span>
    </div>
  )
}

export default FSBOBadge