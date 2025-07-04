'use client'
import { useState } from 'react'

export default function UploadPropertyForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    features: [],
    video_url: '',
    images: [] as File[]
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm(prev => ({ ...prev, images: Array.from(e.target.files) }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder: upload logic to Supabase Storage + insert into DB
    console.log('Submitting:', form)
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Add a Property</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Property Title" className="w-full p-2 border" onChange={handleChange} />
        <textarea name="description" placeholder="Description" className="w-full p-2 border" onChange={handleChange} />
        <input name="location" placeholder="Location" className="w-full p-2 border" onChange={handleChange} />
        <input name="price" placeholder="Price (GYD)" type="number" className="w-full p-2 border" onChange={handleChange} />
        <input name="bedrooms" placeholder="Bedrooms" type="number" className="w-full p-2 border" onChange={handleChange} />
        <input name="bathrooms" placeholder="Bathrooms" type="number" className="w-full p-2 border" onChange={handleChange} />
        <input name="video_url" placeholder="YouTube Video Link" className="w-full p-2 border" onChange={handleChange} />
        <input type="file" accept="image/*" multiple onChange={handleFileChange} className="w-full p-2" />
        <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded">Submit Property</button>
      </form>
    </div>
  )
}
