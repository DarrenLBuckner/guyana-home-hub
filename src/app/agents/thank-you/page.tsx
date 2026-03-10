import Link from 'next/link'

export const metadata = {
  title: 'Application Submitted',
}

export default function AgentThankYouPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
      <div className="max-w-lg mx-auto text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-green-700 mb-3">
            Application Submitted
          </h1>

          <p className="text-gray-600 mb-6">
            Your profile has been submitted. Our team will review and approve it within 48 hours.
            You will receive an email confirmation once your profile is live.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">What happens next?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>1. Our team reviews your profile for completeness</li>
              <li>2. You receive an approval email within 48 hours</li>
              <li>3. Your agent profile goes live on the platform</li>
              <li>4. You can manage your listings and profile from your dashboard</li>
            </ul>
          </div>

          <Link
            href="/"
            className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 font-semibold"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
