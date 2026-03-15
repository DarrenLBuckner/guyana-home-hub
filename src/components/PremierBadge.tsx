'use client';

import Image from 'next/image';

/**
 * PremierBadge — HomeHub Premier Agent trust indicator.
 *
 * Single source of truth for Premier Agent badge rendering.
 * Uses official brand assets: desktop (horizontal) and mobile (square).
 *
 * Variants:
 *   - 'badge': Compact badge image for cards and inline use (default)
 *   - 'banner': Full-width section with badge for profile page headers
 *   - 'inline': Small badge for tight spaces (property detail pages)
 */

interface PremierBadgeProps {
  variant?: 'badge' | 'banner' | 'inline';
  className?: string;
}

export default function PremierBadge({ variant = 'badge', className = '' }: PremierBadgeProps) {
  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-green-800 via-green-700 to-green-800 ${className}`}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-center">
          {/* Mobile: square badge */}
          <Image
            src="/images/homehub-premier-agent-mobile.png"
            alt="HomeHub Premier Agent"
            width={48}
            height={48}
            className="sm:hidden rounded-lg"
          />
          {/* Desktop: horizontal badge */}
          <Image
            src="/images/homehub-premier-agent-desktop.png"
            alt="HomeHub Premier Agent"
            width={240}
            height={72}
            className="hidden sm:block"
          />
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center ${className}`}>
        <Image
          src="/images/homehub-premier-agent-desktop.png"
          alt="HomeHub Premier Agent"
          width={140}
          height={42}
          className="hidden sm:block"
        />
        <Image
          src="/images/homehub-premier-agent-mobile.png"
          alt="HomeHub Premier Agent"
          width={32}
          height={32}
          className="sm:hidden rounded"
        />
      </span>
    );
  }

  // Default: 'badge' variant — for agent cards
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src="/images/homehub-premier-agent-desktop.png"
        alt="HomeHub Premier Agent"
        width={160}
        height={48}
        className="hidden sm:block"
      />
      <Image
        src="/images/homehub-premier-agent-mobile.png"
        alt="HomeHub Premier Agent"
        width={36}
        height={36}
        className="sm:hidden rounded"
      />
    </span>
  );
}
