'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Phone, Mail, MapPin, User, MessageSquare, CreditCard } from 'lucide-react';

/**
 * Service Booking Component
 * Handles service booking form and submission
 */

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  icon: string;
  category: string;
  price: number;
  currency: string;
  contactEmail: string;
  contactPhone: string;
}

interface ServiceBookingProps {
  service: Service;
}

interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyAddress: string;
  propertyType: string;
  preferredDate: string;
  preferredTime: string;
  alternativeDate: string;
  alternativeTime: string;
  message: string;
  urgency: string;
  contactMethod: string;
}

const getIconEmoji = (icon: string) => {
  const iconMap = {
    camera: '📸',
    drone: '🚁',
    cube: '🏠',
    lock: '🔐',
    package: '📦'
  };
  return iconMap[icon as keyof typeof iconMap] || '⭐';
};

const formatPrice = (price: number, currency: string) => {
  if (currency === 'GYD') {
    return `G$${price.toLocaleString()}`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(price);
};

export default function ServiceBooking({ service }: ServiceBookingProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    propertyAddress: '',
    propertyType: '',
    preferredDate: '',
    preferredTime: '',
    alternativeDate: '',
    alternativeTime: '',
    message: '',
    urgency: 'normal',
    contactMethod: 'email'
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/services/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: service.id,
          serviceName: service.name,
          servicePrice: service.price,
          serviceCurrency: service.currency,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit booking. Please try again or call us directly.');
      console.error('Booking submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
        <div className="max-w-md w-full mx-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Submitted!</h2>
            <p className="text-gray-600 mb-6">
              We've received your booking request for {service.name}. 
              We'll contact you within 24 hours to confirm your appointment.
            </p>
            <div className="space-y-4">
              <Link
                href={`/services/${service.slug}`}
                className="block w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors"
              >
                Back to Service
              </Link>
              <Link
                href="/services"
                className="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Browse Other Services
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link
                href={`/services/${service.slug}`}
                className="flex items-center text-green-600 hover:text-green-700 mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Service
              </Link>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Step 1 of 2:</span> Booking Details
            </div>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Service Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>
                  
                  <div className="flex items-center mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-xl mr-4">
                      {getIconEmoji(service.icon)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{service.category} Service</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Service Price:</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatPrice(service.price, service.currency)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-6">
                    {service.shortDescription}
                  </p>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-green-600" />
                      {service.contactPhone}
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-green-600" />
                      {service.contactEmail}
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-green-900 mb-2">What happens next?</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• We'll review your request within 24 hours</li>
                    <li>• Contact you to confirm availability</li>
                    <li>• Schedule your service appointment</li>
                    <li>• Send confirmation with details</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">
                  Book {service.name}
                </h1>

                {error && (
                  <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-green-600" />
                      Contact Information
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Property Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-green-600" />
                      Property Information
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor="propertyAddress" className="block text-sm font-medium text-gray-700 mb-1">
                          Property Address *
                        </label>
                        <input
                          type="text"
                          id="propertyAddress"
                          name="propertyAddress"
                          required
                          value={formData.propertyAddress}
                          onChange={handleInputChange}
                          placeholder="e.g., 123 Main Street, Georgetown, Guyana"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                          Property Type *
                        </label>
                        <select
                          id="propertyType"
                          name="propertyType"
                          required
                          value={formData.propertyType}
                          onChange={handleInputChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                          <option value="">Select Property Type</option>
                          <option value="house">House</option>
                          <option value="apartment">Apartment</option>
                          <option value="condo">Condo</option>
                          <option value="land">Land</option>
                          <option value="commercial">Commercial</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Scheduling */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-green-600" />
                      Preferred Schedule
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Preferred Date *
                        </label>
                        <input
                          type="date"
                          id="preferredDate"
                          name="preferredDate"
                          required
                          value={formData.preferredDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-1">
                          Preferred Time *
                        </label>
                        <select
                          id="preferredTime"
                          name="preferredTime"
                          required
                          value={formData.preferredTime}
                          onChange={handleInputChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                          <option value="">Select Time</option>
                          <option value="8:00 AM">8:00 AM</option>
                          <option value="9:00 AM">9:00 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="12:00 PM">12:00 PM</option>
                          <option value="1:00 PM">1:00 PM</option>
                          <option value="2:00 PM">2:00 PM</option>
                          <option value="3:00 PM">3:00 PM</option>
                          <option value="4:00 PM">4:00 PM</option>
                          <option value="5:00 PM">5:00 PM</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="alternativeDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Alternative Date
                        </label>
                        <input
                          type="date"
                          id="alternativeDate"
                          name="alternativeDate"
                          value={formData.alternativeDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="alternativeTime" className="block text-sm font-medium text-gray-700 mb-1">
                          Alternative Time
                        </label>
                        <select
                          id="alternativeTime"
                          name="alternativeTime"
                          value={formData.alternativeTime}
                          onChange={handleInputChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                          <option value="">Select Time</option>
                          <option value="8:00 AM">8:00 AM</option>
                          <option value="9:00 AM">9:00 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="12:00 PM">12:00 PM</option>
                          <option value="1:00 PM">1:00 PM</option>
                          <option value="2:00 PM">2:00 PM</option>
                          <option value="3:00 PM">3:00 PM</option>
                          <option value="4:00 PM">4:00 PM</option>
                          <option value="5:00 PM">5:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                      Additional Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">
                          Urgency Level
                        </label>
                        <select
                          id="urgency"
                          name="urgency"
                          value={formData.urgency}
                          onChange={handleInputChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                          <option value="normal">Normal</option>
                          <option value="urgent">Urgent (within 3 days)</option>
                          <option value="asap">ASAP (within 24 hours)</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="contactMethod" className="block text-sm font-medium text-gray-700 mb-1">
                          Preferred Contact Method
                        </label>
                        <select
                          id="contactMethod"
                          name="contactMethod"
                          value={formData.contactMethod}
                          onChange={handleInputChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                          <option value="email">Email</option>
                          <option value="phone">Phone Call</option>
                          <option value="whatsapp">WhatsApp</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Special Requests or Questions
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={4}
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Any special requirements, questions, or details we should know..."
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="border-t border-gray-200 pt-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 inline-flex items-center justify-center rounded-md bg-green-600 px-6 py-3 text-lg font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-5 w-5 mr-2" />
                            Submit Booking Request
                          </>
                        )}
                      </button>
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center justify-center rounded-md border border-gray-300 px-6 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        Back to Service
                      </Link>
                    </div>
                    <p className="mt-4 text-sm text-gray-600">
                      * By submitting this form, you agree to our terms of service and privacy policy.
                      No payment is required at this time.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}