import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Guyana Home Hub - Real Estate in Guyana'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Gold accent bar at top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: '#D4A843',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          {/* Logo text */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '16px',
              letterSpacing: '-1px',
            }}
          >
            Guyana Home Hub
          </div>

          {/* Divider */}
          <div
            style={{
              width: '120px',
              height: '4px',
              background: '#D4A843',
              marginBottom: '24px',
              borderRadius: '2px',
            }}
          />

          {/* Tagline */}
          <div
            style={{
              fontSize: '32px',
              color: '#d1fae5',
              marginBottom: '32px',
              textAlign: 'center',
            }}
          >
            Buy, Sell & Rent Property in Guyana
          </div>

          {/* Features row */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              color: '#ffffff',
              fontSize: '20px',
              opacity: 0.9,
            }}
          >
            <span>Verified Properties</span>
            <span style={{ color: '#D4A843' }}>|</span>
            <span>Trusted Agents</span>
            <span style={{ color: '#D4A843' }}>|</span>
            <span>Secure Transactions</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            fontSize: '18px',
            color: '#a7f3d0',
          }}
        >
          guyanahomehub.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
