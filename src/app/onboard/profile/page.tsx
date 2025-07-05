'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function OnboardProfile() {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )

  const [userEmail, setUserEmail] = useState('')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    country: '',
    budget: '',
    roles: [] as string[]
  })

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || '')
      }
    }
    getUser()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    setForm(prev => {
      const roles = checked
        ? [...prev.roles, value]
        : prev.roles.filter(role => role !== value)
      return { ...prev, roles }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert('Please sign in.')

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      full_name: `${form.firstName} ${form.lastName}`,
      phone: form.phone,
      country: form.country,
      budget: form.budget,
      roles: form.roles,
      user_type: 'customer'
    })

    if (error) {
      console.error(error)
      alert('Failed to save profile.')
    } else {
      window.location.href = '/browse'
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Welcome to Guyana Home Hub</h2>
        <p className="mb-6 text-gray-600">
          You're signed in as <strong>{userEmail}</strong>. Just one more step to complete your profile.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">First Name <span className="text-red-500">*</span></label>
              <input
                name="firstName"
                required
                className="w-full border p-2 rounded"
                onChange={handleChange}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">Last Name <span className="text-red-500">*</span></label>
              <input
                name="lastName"
                required
                className="w-full border p-2 rounded"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone Number (WhatsApp OK) <span className="text-red-500">*</span></label>
            <input
              name="phone"
              required
              className="w-full border p-2 rounded"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Country <span className="text-red-500">*</span></label>
            <select
              name="country"
              required
              className="w-full border p-2 rounded"
              onChange={handleChange}
            >
              <option value="">Select Country</option>
              <option value="Guyana">Guyana</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Your Budget <span className="text-gray-500 text-xs">(if buying or renting)</span></label>
            <input
              name="budget"
              placeholder="Optional"
              className="w-full border p-2 rounded"
              onChange={handleChange}
            />
          </div>

          <fieldset className="border p-2 rounded">
            <legend className="text-sm font-semibold mb-1">What best describes you?</legend>
            {['Buyer', 'Seller', 'Renter', 'Agent', 'Just Looking'].map(role => (
              <label key={role} className="block">
                <input
                  type="checkbox"
                  value={role.toLowerCase()}
                  onChange={handleCheckbox}
                  className="mr-2"
                />
                {role}
              </label>
            ))}
          </fieldset>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          >
            Save My Info & Continue
          </button>
        </form>
      </div>
    </div>
  )
}
