'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

interface FormData {
  business_name: string;
  owner_name: string;
  phone: string;
  email: string;
  category: string;
  description: string;
}

interface FormErrors {
  business_name?: string;
  owner_name?: string;
  phone?: string;
  email?: string;
  category?: string;
  description?: string;
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export default function ListYourBusinessPage() {
  const [formData, setFormData] = useState<FormData>({
    business_name: '',
    owner_name: '',
    phone: '',
    email: '',
    category: '',
    description: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.business_name || formData.business_name.length < 2) {
      newErrors.business_name = 'Business name must be at least 2 characters';
    }

    if (!formData.owner_name || formData.owner_name.length < 2) {
      newErrors.owner_name = 'Your name must be at least 2 characters';
    }

    if (!formData.phone || formData.phone.length < 7) {
      newErrors.phone = 'Phone number must be at least 7 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description must be 200 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('https://portalhomehub.com/api/public/business-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          site_id: 'GY',
          business_name: formData.business_name,
          owner_name: formData.owner_name,
          phone: formData.phone,
          email: formData.email,
          category: formData.category,
          description: formData.description || undefined,
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
      setErrorMessage('Unable to connect. Please check your internet and try again.');
      setSubmitStatus('error');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="text-6xl mb-4">&#10003;</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            We'll review your submission and contact you within 48 hours.
          </p>
          <Link
            href="/business-directory"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Back to Directory
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-blue-600 py-12 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold sm:text-4xl"
          >
            List Your Business
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-green-100"
          >
            Get found by property buyers and the Guyanese diaspora community.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 flex items-center justify-center gap-4 text-sm"
          >
            <span className="flex items-center gap-1">
              <span>&#10003;</span> Free listing
            </span>
            <span className="flex items-center gap-1">
              <span>&#10003;</span> Review within 48 hours
            </span>
          </motion.div>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Name */}
            <div>
              <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-1">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="business_name"
                name="business_name"
                value={formData.business_name}
                onChange={handleInputChange}
                className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.business_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Demerara Contracting Services"
              />
              {errors.business_name && (
                <p className="mt-1 text-sm text-red-500">{errors.business_name}</p>
              )}
            </div>

            {/* Owner Name */}
            <div>
              <label htmlFor="owner_name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="owner_name"
                name="owner_name"
                value={formData.owner_name}
                onChange={handleInputChange}
                className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.owner_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., John Singh"
              />
              {errors.owner_name && (
                <p className="mt-1 text-sm text-red-500">{errors.owner_name}</p>
              )}
            </div>

            {/* WhatsApp/Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785"/>
                  </svg>
                  WhatsApp / Phone <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., +592 600 1234"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., contact@mybusiness.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Brief Description{' '}
                <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Tell us briefly what your business does..."
              />
              <div className="mt-1 flex justify-between text-sm">
                {errors.description ? (
                  <p className="text-red-500">{errors.description}</p>
                ) : (
                  <span />
                )}
                <span
                  className={`${
                    formData.description.length > 200 ? 'text-red-500' : 'text-gray-500'
                  }`}
                >
                  {formData.description.length}/200
                </span>
              </div>
            </div>

            {/* Error Message */}
            {submitStatus === 'error' && errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitStatus === 'loading'}
              className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
                submitStatus === 'loading'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'
              }`}
            >
              {submitStatus === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
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
                  Submitting...
                </span>
              ) : (
                'Submit for Review'
              )}
            </button>
          </form>
        </motion.div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            href="/business-directory"
            className="text-gray-600 hover:text-green-600 transition-colors"
          >
            &larr; Back to Business Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
