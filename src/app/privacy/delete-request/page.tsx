'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DeleteRequestPage() {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/privacy/delete-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reason }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setErrorMessage('Failed to submit your request. Please check your connection and try again.');
      setStatus('error');
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <Link
        href="/privacy"
        className="inline-flex items-center text-sm text-green-700 hover:text-green-800 mb-8 transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Privacy Policy
      </Link>

      <h1 className="text-3xl font-bold text-green-700 mb-2">Request Data Deletion</h1>
      <p className="text-gray-600 mb-8">
        You have the right to request deletion of your personal data held by Guyana Home Hub. Complete
        the form below and we will process your request within 30 days.
      </p>

      {status === 'success' ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-green-800 mb-2">Request Received</h2>
          <p className="text-gray-700">
            Your deletion request has been received. We will process it within 30 days and send a
            confirmation to your email.
          </p>
          <p className="text-sm text-gray-600 mt-4">
            If you have questions, contact us at{' '}
            <a href="mailto:info@guyanahomehub.com" className="text-green-700 font-medium hover:underline">
              info@guyanahomehub.com
            </a>
            .
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900 placeholder-gray-400"
              placeholder="you@example.com"
              disabled={status === 'submitting'}
            />
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="reason"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900 placeholder-gray-400 resize-vertical"
              placeholder="Why are you requesting deletion?"
              disabled={status === 'submitting'}
            />
          </div>

          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {status === 'submitting' ? 'Submitting…' : 'Submit Deletion Request'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            By submitting this form, you confirm this request is for your own personal data.
          </p>
        </form>
      )}
    </main>
  );
}
