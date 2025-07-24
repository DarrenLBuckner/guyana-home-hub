'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CountryDropdown } from 'react-country-region-selector'

export default function OnboardProfile() {
  const router = useRouter()
  const supabase = createClient()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [budget, setBudget] = useState('')
  const [roles, setRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (data?.user) {
        setUser(data.user)
        
        // Check if user already has a complete profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
        
        console.log('Profile data:', profile)
        console.log('Profile error:', profileError)
        
        if (profile && profile.first_name && profile.last_name && profile.phone) {
          // User already has a complete profile, redirect to homepage
          console.log('Complete profile found, redirecting to homepage')
          router.push('/')
          return
        }
        
        // Pre-fill form if partial profile exists
        if (profile) {
          console.log('Pre-filling form with existing profile data')
          setFirstName(profile.first_name || '')
          setLastName(profile.last_name || '')
          setPhone(profile.phone || '')
          setCountry(profile.country || '')
          setBudget(profile.budget || '')
          if (profile.roles) {
            setRoles(profile.roles.split(', ').filter(Boolean))
          }
        }
        
        setLoading(false)
      } else {
        console.log('No user found, redirecting to signin')
        router.push('/signin')
      }
    }
    getUser()
  }, [supabase, router])

  const handleRoleChange = (value: string) => {
    setRoles((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert('Please sign in.')
      return
    }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      first_name: firstName,
      last_name: lastName,
      phone,
      country,
      budget,
      roles: roles.join(', '),
      user_type: 'customer',
      updated_at: new Date().toISOString()
    })

    if (error) {
      console.error('Profile save error:', error)
      alert(`Error saving profile info: ${error.message}`)
    } else {
      alert('Profile saved successfully!')
      router.push('/properties/buy')
    }
  }

  if (loading) return <p className="text-center p-8">Loading...</p>

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-green-700">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-md w-full space-y-4">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="First Name *"
            required
            className="w-1/2 border border-gray-300 rounded px-3 py-2"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name *"
            required
            className="w-1/2 border border-gray-300 rounded px-3 py-2"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <input
          type="tel"
          placeholder="WhatsApp Phone Number *"
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <CountryDropdown
          value={country}
          onChange={(val) => setCountry(val)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <input
          type="text"
          placeholder="Your Budget (If Buying or Renting – Optional)"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <div className="space-y-2">
          <p className="text-sm font-medium">I’m interested in (select all that apply):</p>
          <div className="flex flex-wrap gap-2">
            {['Buying', 'Selling', 'Renting', 'Listing Rental', 'I’m an Agent', 'Just Looking'].map((item) => (
              <label key={item} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={item}
                  checked={roles.includes(item)}
                  onChange={() => handleRoleChange(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
        >
          Save My Info & Continue
        </button>
      </form>
    </div>
  )
}
