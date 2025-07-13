'use client'

import { useState } from 'react'

export default function UploadPropertyForm() {
  const [form, setForm] = useState({
    title: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    video_url: '',
    description: '',
    images: [] as File[],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm(prev => ({ ...prev, images: Array.from(e.target.files) }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting:', form)
    alert('This will be wired to Supabase soon.')
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Upload New Property</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
        <input
          type="text"
          name="title"
          placeholder="Property Title"
          value={form.title}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <input
          type="text"
          name="price"
          placeholder="Price (USD)"
          value={form.price}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <input
          type="text"
          name="location"
          placeholder="Location (e.g., Georgetown, Guyana)"
          value={form.location}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <div className="flex gap-4">
          <input
            type="number"
            name="bedrooms"
            placeholder="Bedrooms"
            value={form.bedrooms}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <input
            type="number"
            name="bathrooms"
            placeholder="Bathrooms"
            value={form.bathrooms}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <input
          type="text"
          name="video_url"
          placeholder="YouTube Video URL (optional)"
          value={form.video_url}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <textarea
          name="description"
          placeholder="Property Description"
          rows={5}
          value={form.description}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

       <div className="mb-6">
  <label className="block text-gray-700 font-medium mb-2">Upload Photos</label>

  <div
    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition"
    onClick={() => document.getElementById('fileInput')?.click()}
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      setForm((prev) => ({ ...prev, images: files as File[] }));
    }}
  >
    <p className="text-gray-500">📸 Drag & drop photos here, or click to upload</p>
    <p className="text-sm text-gray-400 mt-1">Up to 16 images. JPG/PNG only.</p>
  </div>

  <input
    id="fileInput"
    type="file"
    accept="image/*"
    multiple
    className="hidden"
    onChange={(e) => {
      if (e.target.files) {
        const files = Array.from(e.target.files).slice(0, 16);
        setForm((prev) => ({ ...prev, images: files }));
      }
    }}
  />

  {/* Thumbnails */}
  {form.images.length > 0 && (
    <div className="mt-4 flex flex-wrap gap-2">
      {form.images.map((file, idx) => (
        <div key={idx} className="w-20 h-20 relative border rounded overflow-hidden">
          <img
            src={URL.createObjectURL(file)}
            alt={`Preview ${idx}`}
            className="object-cover w-full h-full"
          />
        </div>
      ))}
    </div>
  )}
</div>


        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          Submit Listing
        </button>
      </form>
    </div>
  )
}
