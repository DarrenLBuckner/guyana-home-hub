'use client';

/**
 * PremierBadge — HomeHub Premier Agent trust indicator.
 *
 * Single source of truth for Premier Agent badge rendering.
 * Uses official brand assets with responsive breakpoints.
 * Desktop asset: 1205x375 (3.21:1), Mobile asset: 371x374 (~1:1 square)
 *
 * Variants:
 *   - 'badge': For agent cards and section headers (default)
 *   - 'banner': Full-width banner for agent profile page headers
 *   - 'inline': Compact for property detail pages
 */

interface PremierBadgeProps {
  variant?: 'badge' | 'banner' | 'inline';
  className?: string;
}

export default function PremierBadge({ variant = 'badge', className = '' }: PremierBadgeProps) {
  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-green-900 via-green-800 to-green-900 ${className}`}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-center">
          {/* Mobile: square badge */}
          <img
            src="/images/homehub-premier-agent-mobile.png"
            alt="HomeHub Premier Agent"
            className="sm:hidden h-14 w-14 object-contain"
          />
          {/* Desktop: horizontal badge */}
          <img
            src="/images/homehub-premier-agent-desktop.png"
            alt="HomeHub Premier Agent"
            className="hidden sm:block h-14 w-auto object-contain"
          />
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center ${className}`}>
        {/* Mobile: square */}
        <img
          src="/images/homehub-premier-agent-mobile.png"
          alt="HomeHub Premier Agent"
          className="sm:hidden h-8 w-8 object-contain"
        />
        {/* Desktop: horizontal */}
        <img
          src="/images/homehub-premier-agent-desktop.png"
          alt="HomeHub Premier Agent"
          className="hidden sm:block h-8 w-auto object-contain"
        />
      </span>
    );
  }

  // Default: 'badge' variant — for agent cards and section headers
  return (
    <span className={`inline-flex items-center ${className}`}>
      {/* Mobile: square */}
      <img
        src="/images/homehub-premier-agent-mobile.png"
        alt="HomeHub Premier Agent"
        className="sm:hidden h-10 w-10 object-contain"
      />
      {/* Desktop: horizontal */}
      <img
        src="/images/homehub-premier-agent-desktop.png"
        alt="HomeHub Premier Agent"
        className="hidden sm:block h-10 w-auto object-contain"
      />
    </span>
  );
}
