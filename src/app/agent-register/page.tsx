'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react'
import { PromoCodeInput } from '@/components/PromoCodeInput'
import { PromoCodeValidationResult } from '@/types/promo-code'
import { AGENT_PRICING } from '@/types/promo-code'

interface PasswordRequirement {
  label: string
  regex: RegExp
  met: boolean
}

export default function AgentRegistration() {
  const router = useRouter()
  const supabase = createClient()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    country: '',
    // Agent tier selection
    selectedTier: 'basic' as 'basic' | 'pro' | 'elite',
    // Agent verification fields
    agentLicense: '',
    businessName: '',
    businessEmail: '',
    businessRegistration: '',
    yearsExperience: '',
    // New portfolio-based fields
    propertiesSold: '',
    averagePropertyValue: '',
    specializations: [] as string[],
    // Verification documents
    licenseDocument: null as File | null,
    businessDocument: null as File | null,
    // References
    reference1Name: '',
    reference1Email: '',
    reference1Phone: '',
    reference2Name: '',
    reference2Email: '',
    reference2Phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [appliedPromoCode, setAppliedPromoCode] = useState<PromoCodeValidationResult | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)

  // Password requirements
  const getPasswordRequirements = (password: string): PasswordRequirement[] => [
    {
      label: 'At least 12 characters',
      regex: /.{12,}/,
      met: password.length >= 12
    },
    {
      label: 'Contains uppercase letter',
      regex: /[A-Z]/,
      met: /[A-Z]/.test(password)
    },
    {
      label: 'Contains lowercase letter',
      regex: /[a-z]/,
      met: /[a-z]/.test(password)
    },
    {
      label: 'Contains number',
      regex: /\d/,
      met: /\d/.test(password)
    },
    {
      label: 'Contains special character (!@#$%^&*)',
      regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    }
  ]

  const passwordRequirements = getPasswordRequirements(formData.password)
  const isPasswordValid = passwordRequirements.every(req => req.met)
  const doPasswordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0
  const canSavePassword = isPasswordValid && doPasswordsMatch

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    
    // Reset password saved status if password changes
    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      setPasswordSaved(false)
    }
  }

  const handleSavePassword = () => {
    if (canSavePassword) {
      setPasswordSaved(true)
      setError('')
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        setError(error.message)
      } else {
        setResetSent(true)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!passwordSaved) {
      setError('Please save your password first by clicking the "Save Password" button')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            country: formData.country,
            agent_tier: formData.selectedTier
          }
        }
      })

      if (error) {
        setError(error.message)
      } else if (data.user) {
        setCurrentUserId(data.user.id)
        
        // Create profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: formData.email,
              first_name: formData.firstName,
              last_name: formData.lastName,
              phone: formData.phone,
              country: formData.country,
              user_type: 'agent',
              roles: 'agent',
              interest: 'Just Looking',
              vetting_status: 'pending_review' // Default status for new agents
            }
          ])
// Notify admin of new agent registration
await supabase
  .from('admin_notifications')
  .insert([
    {
      admin_email: 'info@guyanahomehub.com',
      title: 'New Agent Registration',
      message: `${formData.firstName} ${formData.lastName} (${formData.email}) registered as an agent.`,
      data: {
        agentId: data.user.id,
        agentEmail: formData.email,
        agentName: `${formData.firstName} ${formData.lastName}`,
        agentTier: formData.selectedTier
      },
      created_at: new Date().toISOString()
    }
  ])

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }

        // Apply promo code if one was selected
        if (appliedPromoCode?.valid) {
          try {
            const { PromoCodeService } = await import('@/lib/promo-code-service')
            const promoResult = await PromoCodeService.applyPromoCode(
              appliedPromoCode.code!,
              data.user.id,
              formData.email,
              formData.selectedTier
            )
            
            if (promoResult.applied) {
              alert(`Registration successful! Your promo code "${appliedPromoCode.code}" has been applied. Please check your email to verify your account.`)
            } else {
              alert('Registration successful! However, there was an issue applying your promo code. Please contact support at info@guyanahomehub.com. Please check your email to verify your account.')
            }
          } catch (promoError) {
            console.error('Promo code application error:', promoError)
            alert('Registration successful! However, there was an issue applying your promo code. Please contact support at info@guyanahomehub.com. Please check your email to verify your account.')
          }
        } else {
          alert('Registration successful! Please check your email to verify your account.')
        }
        
        router.push('/agent-login')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Forgot Password Modal Component
  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center text-green-700">Reset Password</h1>
          
          {resetSent ? (
            <div className="text-center">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Password reset email sent! Check your inbox.
              </div>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-green-700 hover:text-green-800"
              >
                Back to Registration
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-600 text-center mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="text-green-700 hover:text-green-800 text-sm"
                >
                  Back to Registration
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-700">Agent Registration</h1>
        <p className="text-gray-600 text-center mb-6">
          Join Guyana Home Hub as a Property Agent
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="+592-XXX-XXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location/Area
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Georgetown, Guyana"
            />
          </div>

          {/* Enhanced Password Section */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Strong Password</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2 pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    isPasswordValid ? 'border-green-300' : 'border-gray-300'
                  }`}
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  {req.met ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  <span className={req.met ? 'text-green-600' : 'text-gray-600'}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2 pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    doPasswordsMatch ? 'border-green-300' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formData.confirmPassword && !doPasswordsMatch && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <X className="h-4 w-4 mr-1" />
                  Passwords do not match
                </p>
              )}
              {doPasswordsMatch && formData.confirmPassword && (
                <p className="text-green-600 text-sm mt-1 flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Save Password Button */}
            <button
              type="button"
              onClick={handleSavePassword}
              disabled={!canSavePassword || passwordSaved}
              className={`w-full py-2 px-4 rounded font-medium transition-colors ${
                passwordSaved
                  ? 'bg-green-600 text-white cursor-default'
                  : canSavePassword
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {passwordSaved ? (
                <span className="flex items-center justify-center">
                  <Check className="h-5 w-5 mr-2" />
                  Password Saved ✓
                </span>
              ) : (
                'Save Password'
              )}
            </button>
          </div>

          {/* Agent Verification Section */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Verification</h3>
            
            {/* License Section - Now Optional */}
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
              <h4 className="font-medium text-blue-800 mb-2">📋 Professional Licensing (Optional)</h4>
              <p className="text-sm text-blue-700 mb-3">
                If you have an official real estate license, please provide it. If not, don't worry - 
                we'll verify your experience through your portfolio and references.
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Real Estate License Number (if available)
                  </label>
                  <input
                    type="text"
                    name="agentLicense"
                    value={formData.agentLicense}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter license number or leave blank"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Document (if available)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFormData({...formData, licenseDocument: e.target.files?.[0] || null})}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload if you have official documentation</p>
                </div>
              </div>
            </div>

            {/* Experience Portfolio - Primary Verification */}
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <h4 className="font-medium text-green-800 mb-2">🏆 Professional Experience Portfolio *</h4>
              <p className="text-sm text-green-700 mb-3">
                Tell us about your real estate experience. We value proven performance over paperwork.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years in Real Estate *
                  </label>
                  <select
                    name="yearsExperience"
                    value={formData.yearsExperience}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select experience</option>
                    <option value="0-1">Less than 1 year</option>
                    <option value="1-2">1-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="11+">11+ years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Properties Sold in Last 12 Months *
                  </label>
                  <select
                    name="propertiesSold"
                    value={formData.propertiesSold}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select range</option>
                    <option value="0">Just starting out</option>
                    <option value="1-5">1-5 properties</option>
                    <option value="6-15">6-15 properties</option>
                    <option value="16-30">16-30 properties</option>
                    <option value="31-60">31-60 properties (Wow! 🔥)</option>
                    <option value="60+">60+ properties (Superstar! ⭐)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Average Property Value You Handle *
                  </label>
                  <select
                    name="averagePropertyValue"
                    value={formData.averagePropertyValue}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select range</option>
                    <option value="under-10m">Under G$10M</option>
                    <option value="10m-25m">G$10M - G$25M</option>
                    <option value="25m-50m">G$25M - G$50M</option>
                    <option value="50m-100m">G$50M - G$100M</option>
                    <option value="100m+">G$100M+ (Luxury specialist)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Areas of Expertise *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Residential Sales', 'Commercial', 'Land/Lots', 'Luxury Homes', 'Rentals', 'Investment Properties'].map((specialty) => (
                      <label key={specialty} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          className="mr-2"
                          onChange={(e) => {
                            const current = formData.specializations || []
                            if (e.target.checked) {
                              setFormData({...formData, specializations: [...current, specialty]})
                            } else {
                              setFormData({...formData, specializations: current.filter(s => s !== specialty)})
                            }
                          }}
                        />
                        {specialty}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business/Company Name
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Your company or 'Independent Agent'"
                // optional
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Contact Email
              </label>
              <input
                type="email"
                name="businessEmail"
                value={formData.businessEmail}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="your.name@company.com or professional email"
                // optional
              />
              <p className="text-xs text-gray-500 mt-1">Your primary business contact email</p>
              <p className="text-xs text-green-700 mt-1">Note: Providing a business/company name and professional email is optional, but recommended for faster approval.</p>
            </div>

            {/* Professional References */}
            <div className="space-y-3">
              <h4 className="text-md font-medium text-gray-800">Professional References (2 required)</h4>
              
              <div className="grid grid-cols-1 gap-3 border border-gray-200 rounded p-3">
                <p className="text-sm font-medium text-gray-700">Reference 1</p>
                <input
                  type="text"
                  name="reference1Name"
                  value={formData.reference1Name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Name"
                  required
                />
                <input
                  type="email"
                  name="reference1Email"
                  value={formData.reference1Email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Email"
                  required
                />
                <input
                  type="tel"
                  name="reference1Phone"
                  value={formData.reference1Phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Phone"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-3 border border-gray-200 rounded p-3">
                <p className="text-sm font-medium text-gray-700">Reference 2</p>
                <input
                  type="text"
                  name="reference2Name"
                  value={formData.reference2Name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Name"
                  required
                />
                <input
                  type="email"
                  name="reference2Email"
                  value={formData.reference2Email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Email"
                  required
                />
                <input
                  type="tel"
                  name="reference2Phone"
                  value={formData.reference2Phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Phone"
                  required
                />
              </div>
            </div>

            {/* Agent Tier Selection */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800">Choose Your Agent Plan</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(AGENT_PRICING).map(([tier, pricing]) => (
                  <div
                    key={tier}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      formData.selectedTier === tier
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => setFormData({...formData, selectedTier: tier as 'basic' | 'pro' | 'elite'})}
                  >
                    <div className="text-center">
                      <h5 className="font-semibold text-gray-800">{pricing.name}</h5>
                      <div className="text-2xl font-bold text-green-600 my-2">
                        {pricing.currency}{pricing.price.toLocaleString()}<span className="text-sm text-gray-500">/month</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{pricing.description}</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {pricing.features.slice(0, 3).map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Code Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800">Special Offers</h4>
              <PromoCodeInput
                selectedTier={formData.selectedTier}
                userEmail={formData.email}
                userId={currentUserId}
                onPromoCodeAppliedAction={(result) => setAppliedPromoCode(result)}
                onPromoCodeRemovedAction={() => setAppliedPromoCode(null)}
                className="space-y-3"
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="text-sm text-yellow-800">
                <strong>Verification Process:</strong> We verify agents based on experience and performance, not just paperwork. 
                Our team will review your portfolio within 2-3 business days and may contact your references. 
                <br/><br/>
                <strong>Fast Track Approval:</strong> Agents with 6+ properties sold in the last year get priority review. 
                Upon approval, you'll receive a <strong>3-month free trial</strong> to get started.
                <br/><br/>
                <strong>New Agents Welcome:</strong> Just starting? No problem! We offer mentorship and a 1-month trial 
                to help you build your portfolio with us.
              </p>
            </div>
          </div>

          {/* Complete Registration Button */}
          <button
            type="submit"
            disabled={loading || !passwordSaved}
            className={`w-full py-3 px-4 rounded font-semibold transition-colors ${
              passwordSaved
                ? 'bg-green-700 text-white hover:bg-green-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/agent-login" className="text-green-700 hover:text-green-800 font-medium">
              Sign in here
            </a>
          </p>
          <button
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Forgot your password?
          </button>
        </div>
      </div>
    </div>
  )
}
