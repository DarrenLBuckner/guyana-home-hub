'use client'

import { useState } from 'react'
import { analytics, ga4 } from '@/lib/analytics'

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
  propertyId?: string
  agentName?: string
  propertyAddress?: string
  propertyPrice?: string
  source: 'property_page' | 'agent_profile' | 'hero_cta' | 'navbar' | 'footer' | 'anti_scam_guide'
  className?: string
  children?: React.ReactNode
  variant?: 'default' | 'floating' | 'inline' | 'cta'
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

export default function WhatsAppButton({
  phoneNumber = "5927629797", // Default Guyana Home Hub number
  message,
  propertyId,
  agentName,
  propertyAddress,
  propertyPrice,
  source,
  className = "",
  children,
  variant = 'default',
  size = 'md',
  showIcon = true
}: WhatsAppButtonProps) {
  const [clicked, setClicked] = useState(false)

  // Generate contextual message based on source and property info
  const generateMessage = () => {
    if (message) return message

    const baseGreeting = "Hi Guyana Home Hub! "
    
    switch (source) {
      case 'property_page':
        if (propertyId && propertyAddress) {
          return `${baseGreeting}I'm interested in the property at ${propertyAddress}${propertyPrice ? ` listed at ${propertyPrice}` : ''}. Can you provide more details?`
        }
        return `${baseGreeting}I'm interested in a property I saw on your website. Can you help me with more information?`
      
      case 'agent_profile':
        if (agentName) {
          return `${baseGreeting}I'd like to connect with ${agentName} about property listings. Can you help facilitate this connection?`
        }
        return `${baseGreeting}I'd like to connect with one of your verified agents about properties in my area of interest.`
      
      case 'hero_cta':
        return `${baseGreeting}I'm looking to buy/rent property in Guyana. Can you help me get started with the search process?`
      
      case 'anti_scam_guide':
        return `${baseGreeting}I read your anti-scam guide and would like help with property verification and safe buying process.`
      
      default:
        return `${baseGreeting}I'm interested in Guyana real estate and would like to learn more about your services.`
    }
  }

  const handleClick = async () => {
    setClicked(true)
    
    // Track the WhatsApp click event
    try {
      await analytics.whatsappClick(source, propertyId)
      ga4.trackWhatsAppClick(source, propertyId)
      
      // Track diaspora engagement if property info available
      if (propertyId) {
        await analytics.diasporaInterest('unknown', 'GY', 'whatsapp_property_inquiry')
        ga4.trackDiasporaEngagement('unknown', 'GY', 'whatsapp_property_inquiry')
      }
    } catch (error) {
      console.error('Analytics tracking failed:', error)
    }

    // Small delay to ensure tracking completes
    setTimeout(() => {
      setClicked(false)
    }, 1000)
  }

  const encodedMessage = encodeURIComponent(generateMessage())
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

  // Variant-based styling
  const getVariantStyles = () => {
    const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
    
    const sizeStyles = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-6 py-4 text-lg"
    }

    switch (variant) {
      case 'floating':
        // Hidden on mobile/tablet to avoid overlapping with CTAs, visible on md+ screens
        return `${baseStyles} ${sizeStyles[size]} hidden md:inline-flex fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105`
      
      case 'cta':
        return `${baseStyles} ${sizeStyles[size]} bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg`
      
      case 'inline':
        return `${baseStyles} ${sizeStyles[size]} bg-green-600 hover:bg-green-700 text-white rounded-md`
      
      default:
        return `${baseStyles} ${sizeStyles[size]} bg-green-600 hover:bg-green-700 text-white rounded-lg`
    }
  }

  const iconSvg = showIcon && (
    <svg 
      className={`${size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} ${children ? 'mr-2' : ''}`}
      fill="currentColor" 
      viewBox="0 0 24 24"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785"/>
    </svg>
  )

  const buttonContent = children || (
    <>
      {iconSvg}
      {variant === 'floating' ? '' : 'WhatsApp'}
    </>
  )

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`${getVariantStyles()} ${className} ${clicked ? 'opacity-75 scale-95' : ''}`}
      aria-label={`Contact via WhatsApp about ${propertyAddress || 'property inquiry'}`}
    >
      {buttonContent}
    </a>
  )
}

// Specialized WhatsApp components for different use cases
export function PropertyWhatsAppButton({ 
  propertyId, 
  propertyAddress, 
  propertyPrice, 
  agentName,
  className 
}: { 
  propertyId: string
  propertyAddress?: string
  propertyPrice?: string
  agentName?: string
  className?: string 
}) {
  return (
    <WhatsAppButton
      source="property_page"
      propertyId={propertyId}
      propertyAddress={propertyAddress}
      propertyPrice={propertyPrice}
      agentName={agentName}
      variant="inline"
      className={className}
    />
  )
}

export function AgentWhatsAppButton({ 
  agentName, 
  agentPhone,
  className 
}: { 
  agentName: string
  agentPhone?: string
  className?: string 
}) {
  return (
    <WhatsAppButton
      source="agent_profile"
      agentName={agentName}
      phoneNumber={agentPhone}
      variant="inline"
      className={className}
    />
  )
}

export function FloatingWhatsAppButton() {
  return (
    <WhatsAppButton
      source="navbar"
      variant="floating"
      size="lg"
      message="Hi Guyana Home Hub! I need assistance with finding property or have questions about your services."
    />
  )
}

export function HeroWhatsAppCTA({ className }: { className?: string }) {
  return (
    <WhatsAppButton
      source="hero_cta"
      variant="cta"
      size="lg"
      className={className}
    >
      <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785"/>
      </svg>
      Get Instant Property Help
    </WhatsAppButton>
  )
}