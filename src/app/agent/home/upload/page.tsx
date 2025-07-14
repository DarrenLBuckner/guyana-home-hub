'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import UploadPhotos from '@/components/UploadPhotos'

type FormState = {
  title: string
  price: string
  location: string
  bedrooms: string
  bathrooms: string
  video: string
  homeSize: string
  lotSize: string
  description: string
  images: File[]
  features: string[]
  heroIndex: number
}

export default function UploadPropertyForm() {
  const [form, setForm] = useState<FormState>({
    title: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    video: '',
    homeSize: '',
    lotSize: '',
    description: '',
    images: [],
    features: [],
    heroIndex: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFeatureToggle = (feature: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 1) get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) throw userError || new Error('No user')

      // 2) upload each image, collect its public URL
      const uploadedImageUrls: string[] = []
      for (const file of form.images) {
        const filename = `${Date.now()}_${file.name}`

        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filename, file)

        if (uploadError) {
          console.error('Upload to storage failed:', uploadError)
          alert('Failed to upload one or more images.')
          return
        }

        // build the public URL
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/property-images/${filename}`
        uploadedImageUrls.push(url)
      }

      // 3) insert into properties table
      const { error: insertError } = await supabase
        .from('properties')
        .insert([
          {
            user_id: user.id,
            title: form.title,
            description: form.description,
            price: parseFloat(form.price),
            status: 'pending',
            location: form.location,
            bedrooms: parseInt(form.bedrooms, 10),
            bathrooms: parseInt(form.bathrooms, 10),
            video_url: form.video,
            lot_size: form.lotSize,
            home_size: form.homeSize,
            features: form.features,
            image_urls: uploadedImageUrls,
            hero_index: form.heroIndex,
          },
        ])

      if (insertError) {
        console.error('Insert into properties failed:', insertError)
        alert('Failed to save property.')
      } else {
        alert('Property submitted successfully!')
        // optional: reset form or redirect…
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      alert('Something went wrong. Please try again.')
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
    'Gated Community',
  ]

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        Upload New Property
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic fields */}
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
          placeholder="Location"
          className="w-full border border-gray-300 rounded p-2"
        />

        {/* Bedrooms / bathrooms */}
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

        {/* Video / sizes */}
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

        {/* Description */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Property Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe the property..."
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* Features */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Property Features
          </label>
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

        {/* Photo uploader */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Photos
          </label>
          <UploadPhotos
            images={form.images}
            setImages={(imgs) => setForm((f) => ({ ...f, images: imgs }))}
            heroIndex={form.heroIndex}
            setHeroIndex={(i) => setForm((f) => ({ ...f, heroIndex: i }))}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 disabled:opacity-50"
        >
          {isLoading ? 'Submitting…' : 'Submit Listing'}
        </button>
      </form>
    </div>
  )
}
