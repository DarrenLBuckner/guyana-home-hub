'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AgentVetting() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    companyName: '',
    licenseNumber: '',
    yearsExperience: '',
    specialties: '',
    businessAddress: '',
    website: '',
    linkedinProfile: '',
    references: '',
    targetAreas: '',
    businessDescription: ''
  })
  const [documents, setDocuments] = useState({
    profilePhoto: null as File | null,
    businessLicense: null as File | null,
    realtorLicense: null as File | null,
    idDocument: null as File | null,
    businessCertificate: null as File | null
  })

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/agent-login')
        return
      }

      // Check if user is marked as agent in profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profile || (profile.user_type !== 'agent' && profile.roles !== 'agent')) {
        router.push('/agent-login')
        return
      }

      setUser(user)
      setLoading(false)
    }
    checkAuth()
  }, [supabase, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0] || null
    setDocuments({
      ...documents,
      [field]: file
    })
  }

  const uploadFile = async (file: File, bucket: string, fileName: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return publicUrlData.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const documentUrls: { [key: string]: string } = {}

      // Upload documents to Supabase storage
      for (const [key, file] of Object.entries(documents)) {
        if (file) {
          const fileName = `${user.id}/${key}_${Date.now()}_${file.name}`
          const url = await uploadFile(file, 'agent-documents', fileName)
          documentUrls[key] = url
        }
      }

      // Save vetting information to database
      const { error } = await supabase
        .from('agent_vetting')
        .insert([
          {
            user_id: user.id,
            company_name: formData.companyName,
            license_number: formData.licenseNumber,
            years_experience: parseInt(formData.yearsExperience) || 0,
            specialties: formData.specialties,
            business_address: formData.businessAddress,
            website: formData.website,
            linkedin_profile: formData.linkedinProfile,
            references: formData.references,
            target_areas: formData.targetAreas,
            business_description: formData.businessDescription,
            document_urls: documentUrls,
            status: 'pending_review',
            submitted_at: new Date().toISOString()
          }
        ])

      if (error) {
        console.error('Vetting submission error:', error)
        alert('Error submitting vetting information. Please try again.')
        return
      }

      // Update profile status to indicate vetting submitted
      await supabase
        .from('profiles')
        .update({ 
          vetting_status: 'pending_review',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      alert('Thank you! Your agent application has been submitted for review. You will be contacted within 2-3 business days.')
      router.push('/agent-login')

    } catch (err) {
      console.error('Submission error:', err)
      alert('An error occurred while submitting your application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-700 mb-4">Agent Verification Process</h1>
          <p className="text-gray-600 text-lg">
            To ensure the highest quality service for our clients, all agents must complete our verification process.
          </p>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> All information will be reviewed by our team. You'll receive approval notification within 2-3 business days.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Professional Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Professional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company/Agency Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Century 21 Guyana"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Real Estate License Number
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                  placeholder="License # (if applicable)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience *
                </label>
                <select
                  name="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select experience</option>
                  <option value="0">New to real estate</option>
                  <option value="1">1-2 years</option>
                  <option value="3">3-5 years</option>
                  <option value="6">6-10 years</option>
                  <option value="11">11-15 years</option>
                  <option value="16">16+ years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialties
                </label>
                <input
                  type="text"
                  name="specialties"
                  value={formData.specialties}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Residential, Commercial, Land Development"
                />
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Business Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address *
                </label>
                <textarea
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                  placeholder="Complete business address"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                    placeholder="https://your-website.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedinProfile"
                    value={formData.linkedinProfile}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                    placeholder="https://linkedin.com/in/yourname"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Service Areas *
                </label>
                <input
                  type="text"
                  name="targetAreas"
                  value={formData.targetAreas}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Georgetown, New Amsterdam, Linden"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description *
                </label>
                <textarea
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                  placeholder="Describe your real estate services, approach, and what makes you unique..."
                  required
                />
              </div>
            </div>
          </div>

          {/* References */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Professional References</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                References (2-3 professional contacts)
              </label>
              <textarea
                name="references"
                value={formData.references}
                onChange={handleInputChange}
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                placeholder="Name, Title, Company, Phone, Email (one per line)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Include business associates, previous employers, or long-term clients who can vouch for your professionalism.
              </p>
            </div>
          </div>

          {/* Document Uploads */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Required Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Profile Photo *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'profilePhoto')}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Professional headshot for your agent profile</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Government-Issued ID *
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, 'idDocument')}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Driver's license, passport, or national ID</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Real Estate License
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, 'realtorLicense')}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">Real estate license certificate (if applicable)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business License/Certificate
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, 'businessLicense')}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">Business registration or incorporation certificate</p>
              </div>
            </div>
          </div>

          {/* Consent & Submission */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Verification Agreement</h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p>By submitting this application, I confirm that:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>All information provided is accurate and truthful</li>
                <li>I have the right to offer real estate services in Guyana</li>
                <li>I agree to Guyana Home Hub's agent terms of service</li>
                <li>I understand that false information may result in account termination</li>
                <li>I consent to background and reference verification</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting Application...' : 'Submit for Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
