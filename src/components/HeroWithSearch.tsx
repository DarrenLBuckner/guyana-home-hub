'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroWithSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/browse?location=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div>
      {/* Hero Section with Search Bar */}
      <div 
        style={{
          width: '100%',
          height: '60vh',
          position: 'relative',
          backgroundColor: '#1f2937'
        }}
        className="md:h-[80vh]"
      >
        {/* Desktop Image */}
        <img
          src="/images/hero-house-desktop.jpg"
          alt="Hero House Guyana"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute'
          }}
          className="hidden md:block"
        />
        
        {/* Mobile Image */}
        <img
          src="/images/hero-family-mobile.jpg" 
          alt="Hero Family Guyana"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute'
          }}
          className="block md:hidden"
        />
        
        {/* Overlay with Content */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 1rem'
        }}>
          {/* Main Heading */}
          <h1 style={{
            color: 'white',
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '2rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}>
            Find Your Dream Property in Guyana
          </h1>
          
          {/* Search Bar */}
          <div style={{ width: '100%', maxWidth: '600px', position: 'relative' }}>
            <div style={{
              display: 'flex',
              backgroundColor: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
              <input
                type="text"
                placeholder="Enter area, neighborhood, or city in Guyana..."
                style={{
                  flex: 1,
                  padding: '16px 20px',
                  fontSize: '16px',
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'white',
                  color: '#333'
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
              />
              <button
                onClick={handleSearch}
                style={{
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  padding: '16px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.backgroundColor = '#15803d';
                }}
                onMouseOut={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.backgroundColor = '#16a34a';
                }}
              >
                Search
              </button>
            </div>

            {/* Popular Searches */}
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <p style={{
                color: 'white',
                fontSize: '14px',
                marginBottom: '8px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}>
                Popular searches:
              </p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                justifyContent: 'center'
              }}>
                {['Georgetown', 'New Amsterdam', 'Linden', 'Anna Regina'].map(area => (
                  <button
                    key={area}
                    onClick={() =>
                      router.push(`/browse?location=${encodeURIComponent(area)}`)
                    }
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '20px',
                      padding: '6px 16px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}
                    onMouseOver={(e) => {
                      const target = e.target as HTMLButtonElement;
                      target.style.backgroundColor = 'rgba(255,255,255,0.3)';
                      target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                      const target = e.target as HTMLButtonElement;
                      target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                      target.style.transform = 'translateY(0)';
                    }}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
