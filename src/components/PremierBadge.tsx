'use client';

/**
 * PremierBadge — HomeHub Premier Agent trust indicator.
 *
 * Single source of truth for Premier Agent badge rendering.
 * Used across agent cards, profiles, and listing detail pages.
 *
 * Variants:
 *   - 'badge': Compact pill for cards and inline use (default)
 *   - 'banner': Full-width banner for profile page headers
 *   - 'inline': Minimal text-only for tight spaces
 */

interface PremierBadgeProps {
  variant?: 'badge' | 'banner' | 'inline';
  className?: string;
}

export default function PremierBadge({ variant = 'badge', className = '' }: PremierBadgeProps) {
  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 text-white ${className}`}>
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-medium">
          <svg className="w-4 h-4 text-yellow-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>HomeHub Premier Agent</span>
          <span className="hidden sm:inline text-amber-200">|</span>
          <span className="hidden sm:inline text-amber-100">Verified &amp; Trusted by HomeHub</span>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center gap-1 text-amber-700 text-xs font-semibold ${className}`}>
        <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        Premier Agent
      </span>
    );
  }

  // Default: 'badge' variant — compact pill
  return (
    <span className={`inline-flex items-center gap-1 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-amber-200 shadow-sm ${className}`}>
      <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      Premier Agent
    </span>
  );
}
