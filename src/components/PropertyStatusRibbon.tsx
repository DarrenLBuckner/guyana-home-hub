// Property Status Ribbon - Replaces "For Sale" ribbon when property has special status
// src/components/PropertyStatusRibbon.tsx

'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface PropertyStatusRibbonProps {
  status: string
  listingType?: 'sale' | 'rent'
  className?: string
}

export function PropertyStatusRibbon({ status, listingType, className }: PropertyStatusRibbonProps) {
  // Priority order: sold > under_contract > active
  // ONLY ONE RIBBON — status overrides listing type
  
  const getRibbonConfig = () => {
    // Sold takes highest priority
    if (status === 'sold') {
      return { 
        text: 'SOLD', 
        color: 'bg-red-600 text-white',
        priority: 1 
      }
    }
    
    // Under contract / pending takes second priority
    if (status === 'under_contract' || status === 'pending') {
      return { 
        text: 'PENDING', 
        color: 'bg-orange-500 text-white',
        priority: 2 
      }
    }
    
    // Active/Available — show listing type
    if (status === 'active' || status === 'available' || status === 'approved') {
      if (listingType === 'rent') {
        return { 
          text: 'FOR RENT', 
          color: 'bg-blue-500 text-white',
          priority: 3 
        }
      }
      return { 
        text: 'FOR SALE', 
        color: 'bg-green-600 text-white',
        priority: 4 
      }
    }
    
    // Default fallback (shouldn't happen for public listings)
    return null
  }

  const config = getRibbonConfig()
  
  if (!config) return null

  // Corner ribbon style - positioned absolutely in top-left
  return (
    <div className={cn("absolute top-3 left-0 z-10", className)}>
      <div className={cn(
        "text-xs font-bold px-3 py-1 rounded-r-lg shadow-md uppercase tracking-wide",
        config.color
      )}>
        {config.text}
      </div>
    </div>
  )
}

// Alternative diagonal corner ribbon style (can be swapped if preferred)
export function PropertyStatusRibbonDiagonal({ status, listingType, className }: PropertyStatusRibbonProps) {
  const getRibbonConfig = () => {
    if (status === 'sold') {
      return { 
        text: 'SOLD', 
        color: 'bg-red-600 text-white',
      }
    }
    
    if (status === 'under_contract' || status === 'pending') {
      return { 
        text: 'PENDING', 
        color: 'bg-orange-500 text-white',
      }
    }
    
    if (status === 'active' || status === 'available' || status === 'approved') {
      if (listingType === 'rent') {
        return { 
          text: 'FOR RENT', 
          color: 'bg-blue-500 text-white',
        }
      }
      return { 
        text: 'FOR SALE', 
        color: 'bg-green-600 text-white',
      }
    }
    
    return null
  }

  const config = getRibbonConfig()
  
  if (!config) return null

  return (
    <div className={cn("absolute top-0 left-0 overflow-hidden w-20 h-20 z-10", className)}>
      <div className={cn(
        "text-[10px] font-bold text-center transform -rotate-45 -translate-x-6 translate-y-5 w-28 py-1 shadow-md uppercase tracking-wide",
        config.color
      )}>
        {config.text}
      </div>
    </div>
  )
}

export default PropertyStatusRibbon