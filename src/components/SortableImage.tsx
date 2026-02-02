'use client'

import React, { useEffect, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type Props = {
  id: string
  file: File
  isHero: boolean
  onMakeHero: () => void
  onRemove?: () => void
}

export default function SortableImage({ id, file, isHero, onMakeHero, onRemove }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  // FIX: Memoize blob URL to prevent re-creation on every render
  // This fixes tablet browser race condition where URL was revoked before image loaded
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    // Create URL only once when file changes
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setImageError(false)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      tabIndex={0}                              // 3. keyboard-focusable
      className="relative border rounded overflow-hidden"
    >
      {imageError ? (
        <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
          Failed to load
        </div>
      ) : previewUrl ? (
        <img
          src={previewUrl}
          alt={`Property image preview #${id}`} // 2. descriptive alt
          className="object-cover w-full h-32"
          onError={() => {
            console.error('IMAGE PREVIEW: Failed to load image', { id, fileName: file.name })
            setImageError(true)
          }}
          onLoad={() => console.log('IMAGE PREVIEW: Loaded successfully', { id, fileName: file.name })}
        />
      ) : (
        <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Loading...</span>
        </div>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onMakeHero()
        }}
        className={`absolute top-1 right-1 text-xs px-2 py-1 rounded ${
          isHero ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'
        }`}
      >
        {isHero ? 'Main' : 'Set as Main'}
      </button>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="absolute top-1 left-1 text-xs px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
          aria-label="Remove image"
        >
          ✕
        </button>
      )}
    </div>
  )
}
