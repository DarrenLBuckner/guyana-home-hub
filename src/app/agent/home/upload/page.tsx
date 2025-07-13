'use client'

import { useState } from 'react'

export default function UploadPropertyForm() {
  const [form, setForm] = useState({
    title: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    video: '',
    homeSize: '',
    lotSize: '',
    description: '',
    images: [] as File[],
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 16)
    setForm(prev => ({ ...prev, images: files }))
  }

  const generateDescription = async () => {
    setIsLoading(true)

    const prompt = `Write a detailed, friendly real estate listing description for a property with the following info:\n
    Title: ${form.title}
    Price (G$): ${form.price}
    Bedrooms: ${form.bedrooms}
    Bathrooms: ${form.bathrooms}
    Location: ${form.location}
    Home Size: ${form.homeSize} sq ft
    Lot Size: ${form.lotSize} sq ft
    `

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 200,
        }),
      })

      const data = await response.json()
      const content = data?.choices?.[0]?.message?.content

      if (content) {
        setForm(prev => ({ ...prev, description: content.trim() }))
      } else {
        alert('Failed to generate description.')
      }
    } catch (error) {
      console.error('AI error:', error)
      alert('Something went wrong. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting listing:', form)
    // Upload to Supabase here (Step B)
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Upload New Property</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Property Title"
          className="w-full border border-gray-300 rounded p-2"
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price (G$)"
          className="w-full border border-gray-300 rounded p-2"
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location (e.g., Georgetown, Guyana)"
          className="w-full border border-gray-300 rounded p-2"
        />

        <div className="flex gap-4">
          <input
            name="bedrooms"
            value={form.bedrooms}
            onChange={handleChange}
            placeholder="Bedrooms"
            className="w-full border border-gray-300 rounded p-2"
          />
          <input
            name="bathrooms"
            value={form.bathrooms}
            onChange={handleChange}
            placeholder="Bathrooms"
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <input
          name="video"
          value={form.video}
          onChange={handleChange}
          placeholder="YouTube Video URL (optional)"
          className="w-full border border-gray-300 rounded p-2"
        />

        <div className="flex gap-4">
          <input
            name="homeSize"
            value={form.homeSize}
            onChange={handleChange}
            placeholder="Home Size (sq ft)"
            className="w-full border border-gray-300 rounded p-2"
          />
          <input
            name="lotSize"
            value={form.lotSize}
            onChange={handleChange}
            placeholder="Lot Size (sq ft)"
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

       {/* Property Description with AI Assistance */}
<div>
  <label className="block mb-1 text-sm font-medium text-gray-700">
    Property Description
  </label>
  <textarea
    name="description"
    value={form.description}
    onChange={handleChange}
    rows={4}
    placeholder="Let AI help you describe the property..."
    className="w-full border border-gray-300 rounded p-2"
  />

  <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <p className="text-sm text-gray-500 mb-2 sm:mb-0">
      Not sure what to write? Let AI help you create a friendly and accurate property description.
    </p>
    <button
      type="button"
      onClick={generateDescription}
      disabled={isLoading}
      className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {isLoading ? 'Generating with AI...' : 'Use AI to Write Description'}
    </button>
  </div>
</div>


        {/* Upload Photos */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Photos
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center relative">
            <p className="text-sm text-gray-500">
              📸 <span className="underline cursor-pointer">Drag & drop photos here, or click to upload</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">Up to 16 images. JPG/PNG only.</p>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              style={{ position: 'relative', zIndex: 1 }}
            />
          </div>
        </div>

        {/* Submit */}
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
