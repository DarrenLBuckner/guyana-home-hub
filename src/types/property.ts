// Modern Enterprise Property Management - Clean Architecture Pattern
// src/types/property.ts

export interface BaseProperty {
  id: string
  title: string
  description: string
  location: string
  price: number
  created_at: string
  updated_at: string
}

export interface PropertyImages {
  id: string
  property_id: string
  url: string
  alt_text: string
  is_hero: boolean
  sort_order: number
}

export interface PropertyFeatures {
  bedrooms?: number
  bathrooms?: number
  square_footage?: number
  lot_size?: string
  parking_spaces?: number
  year_built?: number
}

export interface PropertyMetadata {
  views: number
  inquiries: number
  favorites: number
  days_on_market: number
  price_history: PriceHistory[]
}

export interface PriceHistory {
  price: number
  date: string
  type: 'initial' | 'increase' | 'decrease'
}

// Complete Property Entity with proper typing
export interface Property extends BaseProperty {
  // Basic Info
  property_type: 'house' | 'apartment' | 'commercial' | 'land' | 'condo'
  listing_type: 'sale' | 'rent'
  status: 'available' | 'pending' | 'sold' | 'rented' | 'off_market'
  
  // Physical Characteristics
  features: PropertyFeatures
  
  // Media
  images: PropertyImages[]
  hero_image?: PropertyImages
  
  // Categorization
  amenities: string[]
  tags: string[]
  
  // Owner/Agent Info
  agent_id: string
  owner_id?: string
  
  // Analytics
  metadata: PropertyMetadata
  
  // SEO
  seo: {
    slug: string
    meta_title?: string
    meta_description?: string
  }
}

// API Response Types
export interface PropertyListResponse {
  properties: Property[]
  total: number
  page: number
  limit: number
  has_more: boolean
}

export interface PropertyFilters {
  status?: Property['status'][]
  property_type?: Property['property_type'][]
  listing_type?: Property['listing_type'][]
  price_min?: number
  price_max?: number
  bedrooms_min?: number
  bathrooms_min?: number
  search_term?: string
  location?: string
  agent_id?: string
}

export interface PropertySortOptions {
  field: 'price' | 'created_at' | 'updated_at' | 'views' | 'days_on_market'
  direction: 'asc' | 'desc'
}

// Form Types
export interface CreatePropertyData extends Omit<Property, 'id' | 'created_at' | 'updated_at' | 'metadata' | 'images' | 'hero_image'> {
  // For form submission, images are Files
  image_files: File[]
  hero_image_index?: number
}

export interface UpdatePropertyData extends Partial<CreatePropertyData> {
  id: string
}
