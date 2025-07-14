'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type Props = {
  id: string
  file: File
  isHero: boolean
  onMakeHero: () => void
}

export default function SortableImage({ id, file, isHero, onMakeHero }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const previewUrl = URL.createObjectURL(file)

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative border rounded overflow-hidden">
      <img src={previewUrl} alt="preview" className="object-cover w-full h-32" />
      <button
        onClick={onMakeHero}
        className={`absolute top-1 right-1 text-xs px-2 py-1 rounded ${
          isHero ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'
        }`}
      >
        {isHero ? 'Main' : 'Set as Main'}
      </button>
    </div>
  )
}
