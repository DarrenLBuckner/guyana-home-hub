/**
 * Analytics tracking utilities for Hero A/B testing and conversion tracking
 */

// Generate a simple session ID for grouping events
function getOrCreateSessionId(): string {
  const key = 'analytics_session_id';
  try {
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    
    const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(key, sessionId);
    return sessionId;
  } catch {
    // Fallback if localStorage is not available
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Track an analytics event
export async function track(
  eventName: string, 
  payload: Record<string, any> = {},
  options: { variant?: string } = {}
) {
  try {
    const sessionId = getOrCreateSessionId();
    
    const eventData = {
      event: eventName,
      payload: {
        ...payload,
        session_id: sessionId,
        variant: options.variant,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        timestamp: new Date().toISOString(),
      }
    };

    // In development, also log to console
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Analytics]', eventName, eventData.payload);
    }

    // Send to our API endpoint
    await fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    }).catch(error => {
      // Fail silently in production to not break user experience
      if (process.env.NODE_ENV !== 'production') {
        console.error('Analytics tracking failed:', error);
      }
    });

  } catch (error) {
    // Fail silently to not break user experience
    if (process.env.NODE_ENV !== 'production') {
      console.error('Analytics error:', error);
    }
  }
}

// Specific tracking functions for common events
export const analytics = {
  // Hero component interactions
  heroView: (variant: 'A' | 'B', site: string) => 
    track('hero_view', { variant, site }),
    
  ctaClick: (cta: string, variant: 'A' | 'B', site: string) => 
    track('cta_click', { cta, variant, site }),
    
  searchSubmit: (query: string, site: string) => 
    track('search_submit', { query, site }),
    
  quickSearch: (city: string, site: string) => 
    track('quick_search', { city, site }),
    
  stickyCtaView: (site: string) => 
    track('sticky_cta_view', { site }),
    
  stickyCtaClick: (site: string) => 
    track('sticky_cta_click', { site }),

  // Page events  
  pageView: (page: string, site: string) =>
    track('page_view', { page, site }),
    
  // Property interactions
  propertyView: (propertyId: string, site: string) =>
    track('property_view', { property_id: propertyId, site }),
    
  propertyContact: (propertyId: string, method: string, site: string) =>
    track('property_contact', { property_id: propertyId, method, site }),

  // Enhanced diaspora tracking for global expansion
  propertyInquiry: (propertyId: string, inquiryType: string, userCountry?: string) =>
    track('property_inquiry', { 
      property_id: propertyId, 
      inquiry_type: inquiryType, 
      user_country: userCountry || 'unknown' 
    }),

  agentContact: (agentId: string, contactMethod: string, propertyId?: string) =>
    track('agent_contact', { 
      agent_id: agentId, 
      contact_method: contactMethod, 
      property_id: propertyId 
    }),

  whatsappClick: (source: string, propertyId?: string) =>
    track('whatsapp_click', { source, property_id: propertyId }),

  diasporaInterest: (userCountry: string, propertyCountry: string, action: string) =>
    track('diaspora_engagement', { 
      user_country: userCountry, 
      property_country: propertyCountry, 
      action 
    }),

  propertySearch: (searchTerms: string, filters: Record<string, any>, resultsCount: number, userCountry?: string) =>
    track('property_search', { 
      search_terms: searchTerms, 
      filters, 
      results_count: resultsCount, 
      user_country: userCountry || 'unknown' 
    }),

  marketResearch: (contentType: string, country: string, engagementLevel: string) =>
    track('market_research_engagement', { 
      content_type: contentType, 
      country, 
      engagement_level: engagementLevel 
    }),

  antiScamContent: (contentSection: string, action: string) =>
    track('anti_scam_engagement', { 
      content_section: contentSection, 
      action 
    }),

  agentRegistration: (step: string, agentType: string, country: string) =>
    track('agent_registration', { 
      step, 
      agent_type: agentType, 
      country 
    }),

  internationalFeatures: (feature: string, fromCountry: string, toCountry: string) =>
    track('international_feature_usage', { 
      feature, 
      from_country: fromCountry, 
      to_country: toCountry 
    }),

  socialShare: (platform: string, contentType: string, contentId: string) =>
    track('social_share', { 
      platform, 
      content_type: contentType, 
      content_id: contentId 
    }),

  userError: (errorType: string, errorMessage: string, userAgent?: string) =>
    track('user_error', { 
      error_type: errorType, 
      error_message: errorMessage, 
      user_agent: userAgent || 'unknown' 
    }),
};

// Google Analytics 4 Configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Enhanced GA4 tracking functions for when GA4 is available
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void
  }
}

// GA4 enhanced tracking functions
export const ga4 = {
  trackPropertyView: (
    propertyId: string,
    propertyType: 'sale' | 'rent' | 'commercial',
    location: string,
    priceRange: string,
    agentType: 'agent' | 'owner' | 'developer'
  ) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_property', {
        event_category: 'Property',
        event_label: propertyId,
        custom_property_type: propertyType,
        custom_location: location,
        custom_price_range: priceRange,
        custom_agent_type: agentType,
        value: 1
      });
    }
  },

  trackPropertyInquiry: (propertyId: string, inquiryType: string, userCountry: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'property_inquiry', {
        event_category: 'Conversion',
        event_label: propertyId,
        custom_inquiry_type: inquiryType,
        custom_user_country: userCountry,
        value: 10
      });
    }
  },

  trackWhatsAppClick: (source: string, propertyId?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'whatsapp_click', {
        event_category: 'Communication',
        event_label: source,
        custom_property_id: propertyId,
        value: 7
      });
    }
  },

  trackDiasporaEngagement: (userCountry: string, propertyCountry: string, action: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'diaspora_engagement', {
        event_category: 'Diaspora',
        event_label: `${userCountry}_to_${propertyCountry}`,
        custom_action: action,
        value: 8
      });
    }
  }
};