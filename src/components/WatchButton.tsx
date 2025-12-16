'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { isPropertyWatched, toggleWatched } from '@/lib/watched-properties'
import { cn } from '@/lib/utils'

interface WatchButtonProps {
  propertyId: string
  variant?: 'icon' | 'button' | 'card'
  className?: string
}

export function WatchButton({ propertyId, variant = 'button', className = '' }: WatchButtonProps) {
  const [isWatched, setIsWatched] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Check localStorage on mount (client-side only)
  useEffect(() => {
    setIsWatched(isPropertyWatched(propertyId))
    setIsLoaded(true)
  }, [propertyId])

  const handleToggle = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    const newState = toggleWatched(propertyId)
    setIsWatched(newState)
  }

  // Don't render until we've checked localStorage (prevents hydration mismatch)
  if (!isLoaded) {
    return null
  }

  // Icon-only variant (for property cards)
  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggle}
        className={cn(
          'p-2 rounded-full transition-colors',
          isWatched
            ? 'bg-green-100 text-green-600 hover:bg-green-200'
            : 'bg-white/90 text-gray-500 hover:bg-gray-100',
          className
        )}
        aria-label={isWatched ? 'Remove from watched' : 'Add to watched'}
        title={isWatched ? 'Remove from watched' : 'Watch this property'}
      >
        {isWatched ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
      </button>
    )
  }

  // Card variant (smaller, for property cards inline text)
  if (variant === 'card') {
    return (
      <button
        onClick={handleToggle}
        className={cn(
          'flex items-center gap-1 text-sm transition-colors',
          isWatched ? 'text-green-600' : 'text-gray-500 hover:text-gray-700',
          className
        )}
        aria-label={isWatched ? 'Remove from watched' : 'Add to watched'}
      >
        {isWatched ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        <span>{isWatched ? 'Watching' : 'Watch'}</span>
      </button>
    )
  }

  // Full button variant (for property detail page)
  return (
    <button
      onClick={handleToggle}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium',
        isWatched
          ? 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200'
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
        className
      )}
      aria-label={isWatched ? 'Remove from watched' : 'Add to watched'}
    >
      {isWatched ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
      <span>{isWatched ? 'Watching' : 'Watch'}</span>
    </button>
  )
}
