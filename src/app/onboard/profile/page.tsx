'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function OnboardProfile() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [budget, setBudget] = useState('')
  const [interests, setInterests] = useState<string[]>([])

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (data?.user) {
        setUser(data.user)
      } else {
        router.push('/signin')
      }
      setLoading(false)
    }
    getUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert('Please sign in to continue.')
      return
    }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      country: country,
      budget: budget,
      interests: interests.join(','),
      updated_at: new Date().toISOString()
    })

    if (error) {
      alert('Error saving profile info.')
      console.error(error)
    } else {
      router.push('/properties/buy') // or dashboard if you prefer
    }
  }

  const handleInterestChange = (value: string) => {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    )
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

        
          <select
  required
  className="w-full border border-gray-300 rounded px-3 py-2"
  value={country}
  onChange={(e) => setCountry(e.target.value)}
>
  <option value="">Select your country</option>
  <option value="Guyana">Guyana</option>
  <option value="United States">United States</option>
  <option value="Canada">Canada</option>
  <option value="United Kingdom">United Kingdom</option>
  <option value="England">England</option>
  <option value="Other">Other</option>
</select>

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
                  checked={interests.includes(item)}
                  onChange={() => handleInterestChange(item)}
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
