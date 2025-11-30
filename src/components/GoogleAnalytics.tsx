'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void
  }
}

interface GoogleAnalyticsProps {
  GA_TRACKING_ID: string
}

export default function GoogleAnalytics({ GA_TRACKING_ID }: GoogleAnalyticsProps) {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', GA_TRACKING_ID, {
        page_path: pathname,
        // Enhanced tracking for diaspora analysis
        custom_map: {
          custom_parameter_1: 'user_country',
          custom_parameter_2: 'property_interest_country',
          custom_parameter_3: 'user_type'
        },
        // Track engagement for property listings
        enhanced_measurement: {
          scroll_tracking: true,
          outbound_clicks: true,
          site_search: true,
          video_engagement: true,
          file_downloads: true
        }
      })
    }
  }, [pathname, GA_TRACKING_ID])

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              // Enhanced tracking for diaspora market analysis
              custom_map: {
                'custom_parameter_1': 'user_country',
                'custom_parameter_2': 'property_interest_country', 
                'custom_parameter_3': 'user_type'
              },
              // Track key user interactions
              enhanced_measurement: {
                scroll_tracking: true,
                outbound_clicks: true,
                site_search: true,
                video_engagement: true,
                file_downloads: true
              },
              // Track conversions important for real estate
              conversion_linker: true,
              // Important for international traffic analysis
              anonymize_ip: false,
              // Track demographics for diaspora insights
              demographics_and_interests: true,
              // Enhanced ecommerce for property inquiries
              enhanced_ecommerce: true
            });

            // Track property viewing events
            function trackPropertyView(propertyId, propertyType, location, price, agentType) {
              gtag('event', 'view_property', {
                event_category: 'Property',
                event_label: propertyId,
                custom_property_type: propertyType,
                custom_location: location,
                custom_price_range: price,
                custom_agent_type: agentType,
                value: 1
              });
            }

            // Track property inquiries (high-value conversion)
            function trackPropertyInquiry(propertyId, inquiryType, userCountry) {
              gtag('event', 'property_inquiry', {
                event_category: 'Conversion',
                event_label: propertyId,
                custom_inquiry_type: inquiryType,
                custom_user_country: userCountry,
                value: 10 // High value for lead generation
              });
            }

            // Track agent contact events
            function trackAgentContact(agentId, contactMethod, propertyId) {
              gtag('event', 'agent_contact', {
                event_category: 'Lead Generation',
                event_label: agentId,
                custom_contact_method: contactMethod,
                custom_property_id: propertyId,
                value: 5
              });
            }

            // Track WhatsApp clicks (critical for Caribbean/Africa markets)
            function trackWhatsAppClick(source, propertyId) {
              gtag('event', 'whatsapp_click', {
                event_category: 'Communication',
                event_label: source,
                custom_property_id: propertyId,
                value: 7
              });
            }

            // Track diaspora-specific events
            function trackDiasporaInterest(userCountry, propertyCountry, action) {
              gtag('event', 'diaspora_engagement', {
                event_category: 'Diaspora',
                event_label: userCountry + '_to_' + propertyCountry,
                custom_action: action,
                value: 8
              });
            }

            // Make functions available globally
            window.trackPropertyView = trackPropertyView;
            window.trackPropertyInquiry = trackPropertyInquiry; 
            window.trackAgentContact = trackAgentContact;
            window.trackWhatsAppClick = trackWhatsAppClick;
            window.trackDiasporaInterest = trackDiasporaInterest;
          `,
        }}
      />
    </>
  )
}