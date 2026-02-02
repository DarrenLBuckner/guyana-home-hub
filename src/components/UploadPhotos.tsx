'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import SortableImage from './SortableImage'

type Props = {
  images: File[]
  setImages: (files: File[]) => void
  heroIndex: number
  setHeroIndex: (index: number) => void
}

export default function UploadPhotos({ images, setImages, heroIndex, setHeroIndex }: Props) {
  const [uploadError, setUploadError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    console.log('IMAGE UPLOAD: onDrop triggered', {
      accepted: acceptedFiles.length,
      rejected: rejectedFiles.length,
      rejectedReasons: rejectedFiles.map(f => f.errors)
    })

    setUploadError(null)

    if (rejectedFiles.length > 0) {
      const errorMsg = `${rejectedFiles.length} file(s) rejected. Only images are accepted.`
      console.warn('IMAGE UPLOAD: Files rejected', rejectedFiles)
      setUploadError(errorMsg)
    }

    if (acceptedFiles.length === 0) {
      console.warn('IMAGE UPLOAD: No files accepted')
      if (rejectedFiles.length === 0) {
        setUploadError('No files selected. Please try again or use a different browser.')
      }
      return
    }

    const newFiles = acceptedFiles.slice(0, 16 - images.length)
    console.log('IMAGE UPLOAD: Adding files to state', {
      newFilesCount: newFiles.length,
      totalAfter: images.length + newFiles.length
    })
    setImages([...images, ...newFiles])
  }, [images, setImages])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
    // Explicit file input for better tablet compatibility
    useFsAccessApi: false,
    noClick: false,
    noKeyboard: false,
  })

  // FIX: Add TouchSensor for proper tablet/mobile support
  const sensors = useSensors(
    useSensor(TouchSensor, {
      // Delay activation to distinguish between tap and drag
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = images.findIndex((_, i) => i.toString() === active.id)
      const newIndex = images.findIndex((_, i) => i.toString() === over.id)
      const newImages = arrayMove(images, oldIndex, newIndex)
      setImages(newImages)
      if (heroIndex === oldIndex) setHeroIndex(newIndex)
      else if (heroIndex === newIndex) setHeroIndex(oldIndex)
    }
  }

  // Remove image handler
  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    // Adjust hero index if needed
    if (heroIndex === index) {
      setHeroIndex(0)
    } else if (heroIndex > index) {
      setHeroIndex(heroIndex - 1)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Upload Photos *
      </label>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer mb-4 transition-colors ${
          isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">📸 Drag & drop up to 16 images here</p>
        <p className="text-sm text-primary underline">or click/tap to upload</p>
        {images.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">{images.length}/16 images selected</p>
        )}
      </div>

      {/* Fallback button for tablets that have issues with dropzone */}
      <button
        type="button"
        onClick={open}
        className="mb-4 text-sm text-green-700 underline hover:text-green-800"
      >
        Having trouble? Tap here to open file picker
      </button>

      {/* Error display */}
      {uploadError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {uploadError}
        </div>
      )}

      {images.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={images.map((_, i) => i.toString())}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {images.map((file, index) => (
                <SortableImage
                  key={`${file.name}-${index}`}
                  id={index.toString()}
                  file={file}
                  isHero={index === heroIndex}
                  onMakeHero={() => setHeroIndex(index)}
                  onRemove={() => handleRemoveImage(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
