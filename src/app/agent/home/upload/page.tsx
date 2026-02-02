'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import UploadPhotos from '@/components/UploadPhotos'
import { useRouter } from 'next/navigation'


type FormState = {
  title: string
  price: string
  location: string
  bedrooms: string
  bathrooms: string
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
  const [generatingDescription, setGeneratingDescription] = useState(false)

  // FIXED: Use same client as agent login
  const supabase = createClient()

  // FIXED: Simple auth check using same client as login
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setAuthChecked(true)
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Upload page - Auth state changed:', event, session?.user?.email)
      setUser(session?.user || null)
      setAuthChecked(true)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

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

  const generateDescription = async () => {
    if (!form.title || !form.location || !form.bedrooms || !form.price) {
      alert('Please fill in title, location, bedrooms, and price first')
      return
    }

    setGeneratingDescription(true)
    try {
      const prompt = `Write a compelling property description for a real estate listing in Guyana. Here are the details:

Title: ${form.title}
Location: ${form.location}
Bedrooms: ${form.bedrooms}
Bathrooms: ${form.bathrooms}
Price: $${form.price}
${form.homeSize ? `Home Size: ${form.homeSize}` : ''}
${form.lotSize ? `Lot Size: ${form.lotSize}` : ''}
${form.features.length > 0 ? `Features: ${form.features.join(', ')}` : ''}

Write a professional, engaging description that highlights the property's best features and appeals to potential buyers. Keep it under 150 words and focus on the location benefits and unique selling points.`

      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        setForm(prev => ({
          ...prev,
          description: data.choices[0].message.content.trim()
        }))
      } else {
        alert('Failed to generate description. Please try again.')
      }
    } catch (error) {
      console.error('Error generating description:', error)
      alert('Error generating description. Please try again.')
    } finally {
      setGeneratingDescription(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log('FORM SUBMIT: Handler triggered')
    console.log('FORM SUBMIT: User state', { hasUser: !!user, email: user?.email })
    console.log('FORM SUBMIT: Form data', {
      title: form.title,
      price: form.price,
      location: form.location,
      imagesCount: form.images.length,
      imageNames: form.images.map(f => f.name),
      heroIndex: form.heroIndex
    })

    if (!user) {
      console.error('FORM SUBMIT: No user - redirecting to login')
      alert('Please log in to upload properties.')
      router.push('/agent-login')
      return
    }

    if (form.images.length === 0) {
      console.error('FORM SUBMIT: No images in form state')
      alert('Please upload at least one image. If you selected images but they are not showing, please try using the "Tap here to open file picker" link or try a different browser.')
      return
    }

    setIsLoading(true)

    try {
      console.log('FORM SUBMIT: Starting upload process...')
      
      // Upload images with better error handling
      const uploadedImageUrls: string[] = []

      console.log('FORM SUBMIT: Starting image uploads', { totalImages: form.images.length })

      for (let i = 0; i < form.images.length; i++) {
        const file = form.images[i]

        // Validate file before upload
        if (!file || !file.name) {
          console.error(`FORM SUBMIT: Invalid file at index ${i}`, file)
          throw new Error(`Invalid file at position ${i + 1}. Please re-select your images.`)
        }

        const filename = `${Date.now()}_${i}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`

        console.log(`FORM SUBMIT: Uploading image ${i + 1}/${form.images.length}`, {
          filename,
          originalName: file.name,
          size: file.size,
          type: file.type
        })

        const { data, error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filename, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('FORM SUBMIT: Upload error', { index: i, error: uploadError })
          throw new Error(`Failed to upload image ${i + 1} (${file.name}): ${uploadError.message}`)
        }

        // FIXED: Use proper public URL generation
        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filename)

        uploadedImageUrls.push(publicUrl)
        console.log(`FORM SUBMIT: Image ${i + 1} uploaded successfully`, { publicUrl })
      }

      console.log('FORM SUBMIT: All images uploaded, inserting property record...')

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
        lot_size: form.lotSize.trim() || null,
        home_size: form.homeSize.trim() || null,
        features: form.features,
        image_urls: uploadedImageUrls,
        hero_index: form.heroIndex,
        // Required for admin dashboard visibility
        site_id: 'guyana',
        listed_by_type: 'agent',
        country_id: 'GY'
      }

      console.log('FORM SUBMIT: Property data to insert', propertyData)

      const { data: insertData, error: insertError } = await supabase
        .from('properties')
        .insert([propertyData])
        .select()

      if (insertError) {
        console.error('FORM SUBMIT: Database insert error', insertError)
        throw new Error(`Failed to save property: ${insertError.message}`)
      }

      console.log('FORM SUBMIT: Property saved successfully', insertData)
      alert('Property submitted successfully! It will be reviewed before going live.')
      
      // Reset form
      setForm({
        title: '',
        price: '',
        location: '',
        bedrooms: '',
        bathrooms: '',
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
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Property Description *
              </label>
              <button
                type="button"
                onClick={generateDescription}
                disabled={generatingDescription}
                className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary/90 disabled:opacity-50"
              >
                {generatingDescription ? '✨ Generating...' : '🤖 Generate with AI'}
              </button>
            </div>
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
