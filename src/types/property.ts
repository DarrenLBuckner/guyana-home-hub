// Modern Enterprise Property Management - Clean Architecture Pattern
// src/types/property.ts

export interface BaseProperty {
  id: string
  title: string
  description: string
  location: string
  city?: string
  region?: string
  neighborhood?: string
  address?: string
  show_address?: boolean
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
  uploaded_by: string // Supabase profile id of uploader
}

export interface PropertyFeatures {
  bedrooms?: number
  bathrooms?: number
  square_footage?: number
  lot_size?: string
  lot_length?: number
  lot_width?: number
  lot_dimension_unit?: string
  land_size_value?: number
  land_size_unit?: string
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
  listing_type: 'sale' | 'rent' | 'lease' | 'short_term_rent'
  status: 'draft' | 'pending' | 'active' | 'available' | 'approved' | 'rejected' | 'expired' | 'off_market' | 'sold' | 'rented' | 'suspended' | 'under_contract'
  
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
  owner_email?: string
  owner_whatsapp?: string
  listed_by_type?: 'owner' | 'agent'
  
  // Analytics
  metadata: PropertyMetadata
  views?: number // Direct views count from database (used by API responses)
  
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
