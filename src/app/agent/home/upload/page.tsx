'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import UploadPhotos from '@/components/UploadPhotos'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()
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
  const [user, setUser] = useState<any>(null)
  const [authChecked, setAuthChecked] = useState(false)

  // FIXED: Use consistent client creation
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )

  // FIXED: Proper auth state management
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          console.log('No authenticated user, redirecting to login')
          router.push('/agent-login')
          return
        }
        
        setUser(user)
        setAuthChecked(true)
        console.log('User authenticated:', user.email)
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/agent-login')
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/agent-login')
      } else if (session?.user) {
        setUser(session.user)
        setAuthChecked(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

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
    
    if (!user) {
      alert('Please log in to upload properties.')
      router.push('/agent-login')
      return
    }

    if (form.images.length === 0) {
      alert('Please upload at least one image.')
      return
    }

    setIsLoading(true)

    try {
      console.log('Starting upload process...')
      
      // Upload images with better error handling
      const uploadedImageUrls: string[] = []
      
      for (let i = 0; i < form.images.length; i++) {
        const file = form.images[i]
        const filename = `${Date.now()}_${i}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`

        console.log(`Uploading image ${i + 1}/${form.images.length}: ${filename}`)

        const { data, error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filename, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          throw new Error(`Failed to upload image ${i + 1}: ${uploadError.message}`)
        }

        // FIXED: Use proper public URL generation
        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filename)

        uploadedImageUrls.push(publicUrl)
        console.log(`Image ${i + 1} uploaded successfully:`, publicUrl)
      }

      console.log('All images uploaded, inserting property record...')

      // Insert property record with better validation
      const propertyData = {
        user_id: user.id,
        title: form.title.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price) || 0,
        status: 'pending',
        location: form.location.trim(),
        bedrooms: parseInt(form.bedrooms, 10) || 0,
        bathrooms: parseInt(form.bathrooms, 10) || 0,
        video_url: form.video.trim() || null,
        lot_size: form.lotSize.trim() || null,
        home_size: form.homeSize.trim() || null,
        features: form.features,
        image_urls: uploadedImageUrls,
        hero_index: form.heroIndex,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data: insertData, error: insertError } = await supabase
        .from('properties')
        .insert([propertyData])
        .select()

      if (insertError) {
        console.error('Database insert error:', insertError)
        throw new Error(`Failed to save property: ${insertError.message}`)
      }

      console.log('Property saved successfully:', insertData)
      alert('Property submitted successfully! It will be reviewed before going live.')
      
      // Reset form
      setForm({
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

      // Redirect to dashboard
      router.push('/agent/home')

    } catch (err) {
      console.error('Submission error:', err)
      alert(`Error: ${err instanceof Error ? err.message : 'Something went wrong. Please try again.'}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Checking authentication...</p>
      </div>
    )
  }

  // Show error if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Please log in to upload properties.</p>
          <button 
            onClick={() => router.push('/agent-login')}
            className="bg-green-700 text-white px-4 py-2 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-2xl font-bold text-green-700 mb-2">
            Upload New Property
          </h1>
          <p className="text-sm text-gray-600">
            Logged in as: {user.email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
          {/* Basic fields with validation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Beautiful 3-bedroom house in Georgetown"
              className="w-full border border-gray-300 rounded p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (G$) *
            </label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="15000000"
              className="w-full border border-gray-300 rounded p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Georgetown, Guyana"
              className="w-full border border-gray-300 rounded p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Bedrooms / bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <input
                name="bedrooms"
                type="number"
                value={form.bedrooms}
                onChange={handleChange}
                placeholder="3"
                min="0"
                className="w-full border border-gray-300 rounded p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms
              </label>
              <input
                name="bathrooms"
                type="number"
                value={form.bathrooms}
                onChange={handleChange}
                placeholder="2"
                min="0"
                className="w-full border border-gray-300 rounded p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Video / sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              YouTube Video URL (optional)
            </label>
            <input
              name="video"
              value={form.video}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full border border-gray-300 rounded p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Home Size (sq ft)
              </label>
              <input
                name="homeSize"
                value={form.homeSize}
                onChange={handleChange}
                placeholder="2500"
                className="w-full border border-gray-300 rounded p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lot Size (sq ft)
              </label>
              <input
                name="lotSize"
                value={form.lotSize}
                onChange={handleChange}
                placeholder="5000"
                className="w-full border border-gray-300 rounded p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the property features, location benefits, and any unique aspects..."
              className="w-full border border-gray-300 rounded p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Features
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {featureList.map((feature) => (
                <label key={feature} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Photo uploader */}
          <div>
            <UploadPhotos
              images={form.images}
              setImages={(imgs) => setForm((f) => ({ ...f, images: imgs }))}
              heroIndex={form.heroIndex}
              setHeroIndex={(i) => setForm((f) => ({ ...f, heroIndex: i }))}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !form.title || !form.price || !form.location || form.images.length === 0}
            className="w-full bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isLoading ? 'Uploading Property...' : 'Submit Listing'}
          </button>

          {isLoading && (
            <div className="text-center text-sm text-gray-600">
              Please wait while we upload your images and save your property...
            </div>
          )}
        </form>
      </div>
    </div>
  )
}