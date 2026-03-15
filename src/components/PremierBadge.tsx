'use client';

/**
 * PremierBadge — HomeHub Premier Agent trust indicator.
 *
 * Single source of truth for Premier Agent badge rendering.
 * Uses official brand assets with responsive breakpoints.
 *
 * Variants:
 *   - 'badge': Compact badge for agent cards (default)
 *   - 'banner': Full-width banner for agent profile page headers
 *   - 'inline': Small badge for property detail pages
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
            className="sm:hidden h-12 w-auto"
          />
          {/* Desktop: horizontal badge */}
          <img
            src="/images/homehub-premier-agent-desktop.png"
            alt="HomeHub Premier Agent"
            className="hidden sm:block h-10 w-auto"
          />
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center ${className}`}>
        <img
          src="/images/homehub-premier-agent-desktop.png"
          alt="HomeHub Premier Agent"
          className="h-7 w-auto"
        />
      </span>
    );
  }

  // Default: 'badge' variant — for agent cards
  return (
    <span className={`inline-flex items-center ${className}`}>
      <img
        src="/images/homehub-premier-agent-desktop.png"
        alt="HomeHub Premier Agent"
        className="h-8 w-auto"
      />
    </span>
  );
}
