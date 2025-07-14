'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.slice(0, 16 - images.length)
    setImages([...images, ...newFiles])
  }, [images, setImages])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
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

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Upload Photos
      </label>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer mb-4"
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">📸 Drag & drop up to 16 images here</p>
        <p className="text-sm text-blue-600 underline">or click to upload</p>
      </div>

      {images.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={images.map((_, i) => i.toString())}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {images.map((file, index) => (
                <SortableImage
                  key={index}
                  id={index.toString()}
                  file={file}
                  isHero={index === heroIndex}
                  onMakeHero={() => setHeroIndex(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
