import { useEffect } from 'react';

/**
 * Custom hook to fix Google search fragment navigation issues
 * Automatically scrolls to top when users land on unwanted URL fragments
 */
export function useFragmentFix() {
  useEffect(() => {
    const handleFragmentFix = () => {
      const hash = window.location.hash;
      
      // Common fragments that Google might add that we want to override
      const unwantedFragments = [
        '#contact', '#footer', '#bottom', '#end', '#info', 
        '#phone', '#email', '#whatsapp', '#help', '#support',
        '#contactus', '#contact-us', '#contact_us', '#contacts',
        '#getintouch', '#reach', '#call', '#tel', '#telephone'
      ];
      
      // If we detect an unwanted fragment, smooth scroll to top and clean URL
      if (hash && unwantedFragments.includes(hash.toLowerCase())) {
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
          // Smooth scroll to top
          window.scrollTo({ 
            top: 0, 
            behavior: 'smooth' 
          });
          
          // Clean the URL without the fragment
          if (window.history && window.history.pushState) {
            const cleanUrl = window.location.pathname + window.location.search;
            window.history.pushState('', document.title, cleanUrl);
          }
          
          console.log(`🔧 Fixed Google fragment issue: ${hash} -> scrolled to top`);
        }, 100);
      }
    };
    
    // Run on page load
    handleFragmentFix();
    
    // Also run if hash changes (back/forward navigation)
    window.addEventListener('hashchange', handleFragmentFix);
    
    // Run on popstate (browser back/forward)
    window.addEventListener('popstate', handleFragmentFix);
    
    return () => {
      window.removeEventListener('hashchange', handleFragmentFix);
      window.removeEventListener('popstate', handleFragmentFix);
    };
  }, []);
}