'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Phone, Mail } from 'lucide-react';

/**
 * Service Detail Component
 * Displays detailed information about a specific service
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
  featuredImage?: string;
  galleryImages: string[];
  additionalInfo?: any;
}

interface ServiceDetailProps {
  service: Service;
  allServices: Service[];
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

export default function ServiceDetail({ service, allServices }: ServiceDetailProps) {
  const relatedServices = allServices
    .filter(s => s.id !== service.id && s.category === service.category)
    .slice(0, 3);

  const serviceFeatures = getServiceFeatures(service.slug);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-green-600">Services</Link>
            <span>/</span>
            <span className="text-gray-900">{service.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Link
              href="/services"
              className="flex items-center text-green-600 hover:text-green-700 mr-6"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Services
            </Link>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Content */}
            <div>
              <div className="flex items-center mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-green-50 text-3xl mr-4">
                  {getIconEmoji(service.icon)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                    {service.name}
                  </h1>
                  <p className="text-lg text-green-600 capitalize font-medium">
                    {service.category} Service
                  </p>
                </div>
              </div>

              <p className="text-xl text-gray-600 mb-8">
                {service.shortDescription}
              </p>

              <div className="mb-8">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatPrice(service.price, service.currency)}
                </div>
                <p className="text-gray-600">Professional service with guaranteed quality</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href={`/services/${service.slug}/book`}
                  className="inline-flex items-center justify-center rounded-md bg-green-600 px-6 py-3 text-lg font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Book This Service
                </Link>
                <a
                  href={`tel:${service.contactPhone}`}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 px-6 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Call Now
                </a>
              </div>

              {/* Contact Info */}
              <div className="rounded-lg bg-gray-50 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-green-600 mr-3" />
                    <a href={`tel:${service.contactPhone}`} className="text-gray-700 hover:text-green-600">
                      {service.contactPhone}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-green-600 mr-3" />
                    <a href={`mailto:${service.contactEmail}`} className="text-gray-700 hover:text-green-600">
                      {service.contactEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Image/Visual */}
            <div>
              <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-8 text-center">
                <div className="text-8xl mb-4">
                  {getIconEmoji(service.icon)}
                </div>
                <p className="text-gray-600">
                  Professional {service.category} service visualization
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="py-16 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">About This Service</h2>
          <div className="prose prose-lg prose-green max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      {serviceFeatures && serviceFeatures.length > 0 && (
        <div className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What's Included</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {serviceFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start p-6 rounded-lg bg-white border border-gray-200"
                >
                  <Check className="h-6 w-6 text-green-600 mr-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <div className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Other {service.category.charAt(0).toUpperCase() + service.category.slice(1)} Services
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((relatedService) => (
                <Link
                  key={relatedService.id}
                  href={`/services/${relatedService.slug}`}
                  className="group block"
                >
                  <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 hover:shadow-md hover:ring-gray-300 transition-all duration-200">
                    <div className="flex items-center mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-xl mr-4">
                        {getIconEmoji(relatedService.icon)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-green-600">
                          {relatedService.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatPrice(relatedService.price, relatedService.currency)}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {relatedService.shortDescription}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="py-16 bg-green-600">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Book {service.name}?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Professional service with guaranteed results for your property
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/services/${service.slug}/book`}
              className="inline-flex items-center justify-center rounded-md bg-white px-8 py-3 text-lg font-semibold text-green-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600"
            >
              Book Now - {formatPrice(service.price, service.currency)}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border-2 border-white px-8 py-3 text-lg font-semibold text-white hover:bg-white hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600"
            >
              Ask Questions First
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get service-specific features
function getServiceFeatures(slug: string) {
  const features = {
    'drone-photography': [
      {
        title: 'Aerial Photography',
        description: '20-30 high-resolution aerial photos from multiple angles'
      },
      {
        title: 'Aerial Video',
        description: '2-3 minute cinematic video showcasing your property'
      },
      {
        title: 'Professional Editing',
        description: 'Color correction, enhancement, and professional editing'
      },
      {
        title: 'High-Resolution Files',
        description: 'Full resolution images for print and web use'
      },
      {
        title: 'Fast Turnaround',
        description: 'Edited photos and videos delivered within 48 hours'
      },
      {
        title: 'Weather Backup',
        description: 'Free rescheduling for weather-related delays'
      }
    ],
    'property-photography': [
      {
        title: 'Interior Photography',
        description: 'Professional photos of all rooms and living spaces'
      },
      {
        title: 'Exterior Photography',
        description: 'Front, back, and side views of your property'
      },
      {
        title: 'HDR Processing',
        description: 'High Dynamic Range imaging for perfect lighting'
      },
      {
        title: 'Wide-Angle Shots',
        description: 'Make rooms appear larger and more spacious'
      },
      {
        title: 'Detail Shots',
        description: 'Close-ups of unique features and amenities'
      },
      {
        title: 'Professional Equipment',
        description: 'DSLR cameras, tripods, and lighting equipment'
      }
    ],
    '3d-virtual-tours': [
      {
        title: '360° Photography',
        description: 'Complete spherical images of every room'
      },
      {
        title: 'Interactive Walkthrough',
        description: 'Clickable floor plan navigation'
      },
      {
        title: 'Measurement Tools',
        description: 'Built-in measuring capabilities for viewers'
      },
      {
        title: 'Mobile Compatibility',
        description: 'Works perfectly on phones, tablets, and computers'
      },
      {
        title: '12-Month Hosting',
        description: 'Free hosting and maintenance for one year'
      },
      {
        title: 'VR Ready',
        description: 'Compatible with VR headsets for immersive viewing'
      }
    ],
    'lockbox-placement': [
      {
        title: 'Secure Installation',
        description: 'Professional mounting on the most secure location'
      },
      {
        title: 'Key Management',
        description: 'Secure key storage and access control'
      },
      {
        title: 'Access Tracking',
        description: 'Log of all access attempts for security'
      },
      {
        title: 'Multiple Access Methods',
        description: 'Traditional combination or smart lock options'
      },
      {
        title: 'Emergency Access',
        description: '24/7 emergency access support'
      },
      {
        title: 'Removal Service',
        description: 'Free removal when property is sold/rented'
      }
    ],
    'ready-to-list-full-service': [
      {
        title: 'Complete Photography',
        description: 'Professional interior, exterior, and drone photography'
      },
      {
        title: '3D Virtual Tour',
        description: 'Interactive 3D walkthrough for remote viewing'
      },
      {
        title: 'Lockbox Installation',
        description: 'Secure access solution for showings'
      },
      {
        title: 'Listing Optimization',
        description: 'Professional description and keyword optimization'
      },
      {
        title: 'Image Enhancement',
        description: 'Professional editing and color correction'
      },
      {
        title: 'Priority Service',
        description: 'Expedited scheduling and completion within 3 days'
      }
    ]
  };

  return features[slug as keyof typeof features] || [];
}