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
};