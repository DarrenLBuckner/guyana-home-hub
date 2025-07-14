'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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
    features: [] as string[],
    images: [] as File[],
  })

  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFeatureToggle = (feature: string) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature],
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 16)
    setForm(prev => ({ ...prev, images: files }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      const uploadedImageUrls: string[] = []
      for (const file of form.images) {
        const filename = `${Date.now()}_${file.name}`
        const { error: uploadError } = await supabase.storage
          .from('property_images')
          .upload(filename, file)

        if (uploadError) {
          alert('Failed to upload images.')
          return
        }

        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/property_images/${filename}`
        uploadedImageUrls.push(url)
      }

      const { error } = await supabase.from('properties').insert([
        {
          user_id: user?.id,
          title: form.title,
          description: form.description,
          price: parseFloat(form.price),
          status: 'pending',
          location: form.location,
          bedrooms: parseInt(form.bedrooms),
          bathrooms: parseInt(form.bathrooms),
          video_url: form.video,
          lot_size: form.lotSize,
          home_size: form.homeSize,
          features: form.features,
          image_urls: uploadedImageUrls,
        }
      ])

      if (error) {
        console.error('Upload failed:', error)
        alert('Property upload failed.')
      } else {
        alert('Property submitted successfully!')
      }
    } catch (err) {
      console.error('Error:', err)
      alert('Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  const featureList = [
    'Swimming Pool',
    'Balcony/Patio',
    'Garden Area',
    'Fenced Yard',
    'Fruit Trees',
    'Air Conditioning',
    'Paved Roads',
    'Garage',
    'Internet Ready',
    'Security System',
    'Washer/Dryer Hookup',
    'Appliances Included',
    'Pet Friendly',
            
  ]

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Upload New Property</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Property Title" className="w-full border border-gray-300 rounded p-2" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price (G$)" className="w-full border border-gray-300 rounded p-2" />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full border border-gray-300 rounded p-2" />

        <div className="flex gap-4">
          <input name="bedrooms" value={form.bedrooms} onChange={handleChange} placeholder="Bedrooms" className="w-full border border-gray-300 rounded p-2" />
          <input name="bathrooms" value={form.bathrooms} onChange={handleChange} placeholder="Bathrooms" className="w-full border border-gray-300 rounded p-2" />
        </div>

        <input name="video" value={form.video} onChange={handleChange} placeholder="YouTube Video URL (optional)" className="w-full border border-gray-300 rounded p-2" />

        <div className="flex gap-4">
          <input name="homeSize" value={form.homeSize} onChange={handleChange} placeholder="Home Size (sq ft)" className="w-full border border-gray-300 rounded p-2" />
          <input name="lotSize" value={form.lotSize} onChange={handleChange} placeholder="Lot Size (sq ft)" className="w-full border border-gray-300 rounded p-2" />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Property Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe the property..." className="w-full border border-gray-300 rounded p-2" />
        </div>

        {/* Property Features */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Property Features</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {featureList.map((feature) => (
              <label key={feature} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.features.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                  className="h-4 w-4 text-green-600"
                />
                <span className="text-sm text-gray-700">{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Upload Photos */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photos</label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center relative">
            <p className="text-sm text-gray-500">
              📸 <span className="underline cursor-pointer">Drag & drop or click to upload</span>
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

        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Submit Listing'}
        </button>
      </form>
    </div>
  )
}
