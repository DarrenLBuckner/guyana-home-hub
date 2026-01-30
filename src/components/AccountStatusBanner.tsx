'use client'

import Link from 'next/link'

interface AccountStatusBannerProps {
  status: 'pending' | 'approved' | 'needs_correction' | 'rejected' | 'suspended'
  userType: 'fsbo' | 'landlord' | 'agent'
  rejectionReason?: string | null
  className?: string
}

export default function AccountStatusBanner({
  status,
  userType,
  rejectionReason,
  className = ''
}: AccountStatusBannerProps) {
  // Don't show banner for approved users
  if (status === 'approved') {
    return null
  }

  const getEditUrl = () => {
    switch (userType) {
      case 'fsbo':
        return '/dashboard/fsbo/application-status/edit'
      case 'landlord':
        return '/dashboard/landlord/application-status/edit'
      case 'agent':
        return '/agent/vetting' // Agents use vetting system
      default:
        return null
    }
  }

  const getStatusUrl = () => {
    switch (userType) {
      case 'fsbo':
        return '/dashboard/fsbo/application-status'
      case 'landlord':
        return '/dashboard/landlord/application-status'
      case 'agent':
        return '/agent/pending'
      default:
        return null
    }
  }

  const editUrl = getEditUrl()
  const statusUrl = getStatusUrl()

  // Pending status
  if (status === 'pending') {
    return (
      <div className={`bg-yellow-50 border-l-4 border-yellow-400 p-4 ${className}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-xl">⏳</span>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm text-yellow-700">
              <strong>Application Pending:</strong> Your account is under review. You'll receive an email once approved.
            </p>
            {statusUrl && (
              <Link href={statusUrl} className="text-sm text-yellow-800 underline hover:text-yellow-900 mt-1 inline-block">
                View Application Status →
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Needs correction status
  if (status === 'needs_correction') {
    return (
      <div className={`bg-orange-50 border-l-4 border-orange-400 p-4 ${className}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-xl">⚠️</span>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm text-orange-700">
              <strong>Action Required:</strong> {rejectionReason || 'Please update your information to continue.'}
            </p>
            <div className="mt-2 flex gap-3">
              {editUrl && (
                <Link
                  href={editUrl}
                  className="inline-flex items-center px-3 py-1.5 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 transition-colors"
                >
                  Edit & Resubmit
                </Link>
              )}
              {statusUrl && (
                <Link href={statusUrl} className="text-sm text-orange-800 underline hover:text-orange-900 self-center">
                  View Details
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Rejected status
  if (status === 'rejected') {
    return (
      <div className={`bg-red-50 border-l-4 border-red-400 p-4 ${className}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-xl">❌</span>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm text-red-700">
              <strong>Application Rejected:</strong> {rejectionReason || 'Your application has been rejected.'}
            </p>
            <p className="text-sm text-red-600 mt-1">
              Please contact support at{' '}
              <a href="mailto:support@guyanahomehub.com" className="underline">support@guyanahomehub.com</a>
              {' '}or{' '}
              <a href="https://wa.me/5927629797" className="underline">WhatsApp +592 762 9797</a>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Suspended status
  if (status === 'suspended') {
    return (
      <div className={`bg-gray-100 border-l-4 border-gray-500 p-4 ${className}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-xl">🚫</span>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm text-gray-700">
              <strong>Account Suspended:</strong> {rejectionReason || 'Your account has been suspended.'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Contact support for assistance:{' '}
              <a href="mailto:support@guyanahomehub.com" className="underline">support@guyanahomehub.com</a>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
