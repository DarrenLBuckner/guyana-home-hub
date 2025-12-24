'use client';

import React, { useState } from 'react';

const CATEGORIES = [
  'Real Estate Agents',
  'Renovations & Repairs',
  'Electrical & Plumbing',
  'Interior & Furniture',
  'Landscaping & Garden',
  'Building Materials & Hardware',
  'Moving & Storage',
  'Cleaning Services',
  'Security & Safety',
  'Legal & Financial',
  'Insurance & Banking',
  'Inspection Services',
  'General Contractors',
];

interface DemandCaptureFormProps {
  preselectedCategory?: string;
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export default function DemandCaptureForm({ preselectedCategory }: DemandCaptureFormProps) {
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState(preselectedCategory || '');
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (!category) {
      setErrorMessage('Please select a service type');
      return;
    }

    setSubmitStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('https://portalhomehub.com/api/public/business-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          site_id: 'GY',
          email,
          category,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
      } else {
        const data = await response.json().catch(() => ({}));
        setErrorMessage(data.message || 'Something went wrong. Please try again.');
        setSubmitStatus('error');
      }
    } catch {
      setErrorMessage('Unable to connect. Please try again.');
      setSubmitStatus('error');
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <p className="text-green-800 font-medium">
          Got it! We'll email you when {category} businesses join.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Email Input */}
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errorMessage) setErrorMessage('');
          }}
          placeholder="Enter your email"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />

        {/* Category Dropdown */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            if (errorMessage) setErrorMessage('');
          }}
          className="sm:w-56 rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="">Select service type</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitStatus === 'loading'}
          className={`px-6 py-3 rounded-lg font-semibold text-white transition-all whitespace-nowrap ${
            submitStatus === 'loading'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {submitStatus === 'loading' ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              ...
            </span>
          ) : (
            'Notify Me'
          )}
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <p className="mt-2 text-sm text-red-500 text-center sm:text-left">{errorMessage}</p>
      )}
    </form>
  );
}
