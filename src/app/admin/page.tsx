'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/admin/dashboard')
  }, [router])

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
        <p className='text-gray-600'>Redirecting to admin dashboard...</p>
      </div>
    </div>
  )
}
