// Modern Data Layer - Repository Pattern with React Query
// src/lib/repositories/propertyRepository.ts

import { createClient } from '@/lib/supabase/client'
import { 
  Property, 
  PropertyListResponse, 
  PropertyFilters, 
  PropertySortOptions,
  CreatePropertyData,
  UpdatePropertyData 
} from '@/types/property'

export class PropertyRepository {
  private supabase = createClient()

  // Get properties with advanced filtering and pagination
  async getProperties(
    filters: PropertyFilters = {},
    sort: PropertySortOptions = { field: 'created_at', direction: 'desc' },
    page = 1,
    limit = 12
  ): Promise<PropertyListResponse> {
    try {
      let query = this.supabase
        .from('properties')
        .select(`
          *,
          images:property_images(*),
          metadata:property_metadata(*),
          agent:profiles!agent_id(name, email, phone)
        `, { count: 'exact' })

      // Apply filters
      if (filters.agent_id) {
        query = query.eq('agent_id', filters.agent_id)
      }

      if (filters.status?.length) {
        query = query.in('status', filters.status)
      }

      if (filters.property_type?.length) {
        query = query.in('property_type', filters.property_type)
      }

      if (filters.listing_type?.length) {
        query = query.in('listing_type', filters.listing_type)
      }

      if (filters.price_min !== undefined) {
        query = query.gte('price', filters.price_min)
      }

      if (filters.price_max !== undefined) {
        query = query.lte('price', filters.price_max)
      }

      if (filters.bedrooms_min !== undefined) {
        query = query.gte('features->bedrooms', filters.bedrooms_min)
      }

      if (filters.bathrooms_min !== undefined) {
        query = query.gte('features->bathrooms', filters.bathrooms_min)
      }

      if (filters.search_term) {
        query = query.or(`
          title.ilike.%${filters.search_term}%,
          description.ilike.%${filters.search_term}%,
          location.ilike.%${filters.search_term}%
        `)
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      // Apply sorting
      query = query.order(sort.field, { ascending: sort.direction === 'asc' })

      // Apply pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }

      // Transform data to match our Property interface
      const properties: Property[] = (data || []).map(this.transformDatabaseProperty)

      return {
        properties,
        total: count || 0,
        page,
        limit,
        has_more: (count || 0) > page * limit
      }

    } catch (error) {
      console.error('Error fetching properties:', error)
      
      // Return mock data for development when database is not ready
      return this.getMockProperties(filters, page, limit)
    }
  }

  // Get single property by ID
  async getProperty(id: string): Promise<Property | null> {
    try {
      const { data, error } = await this.supabase
        .from('properties')
        .select(`
          *,
          images:property_images(*),
          metadata:property_metadata(*),
          agent:profiles!agent_id(name, email, phone)
        `)
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Property not found
        }
        throw new Error(`Database error: ${error.message}`)
      }

      return this.transformDatabaseProperty(data)

    } catch (error) {
      console.error('Error fetching property:', error)
      
      // Return mock data for development
      const mockData = this.getMockProperties()
      return mockData.properties.find(p => p.id === id) || null
    }
  }

  // Create new property
  async createProperty(propertyData: CreatePropertyData): Promise<Property> {
    try {
      // Start transaction
      const { data: property, error: propertyError } = await this.supabase
        .from('properties')
        .insert({
          title: propertyData.title,
          description: propertyData.description,
          location: propertyData.location,
          price: propertyData.price,
          property_type: propertyData.property_type,
          listing_type: propertyData.listing_type,
          status: propertyData.status,
          features: propertyData.features,
          amenities: propertyData.amenities,
          tags: propertyData.tags,
          agent_id: propertyData.agent_id,
          owner_id: propertyData.owner_id,
          seo: propertyData.seo
        })
        .select()
        .single()

      if (propertyError) {
        throw new Error(`Failed to create property: ${propertyError.message}`)
      }

      // Upload and associate images
      if (propertyData.image_files.length > 0) {
        await this.uploadPropertyImages(property.id, propertyData.image_files, propertyData.hero_image_index)
      }

      // Initialize metadata
      await this.initializePropertyMetadata(property.id)

      // Fetch the complete property with all relations
      const createdProperty = await this.getProperty(property.id)
      if (!createdProperty) {
        throw new Error('Failed to fetch created property')
      }

      return createdProperty

    } catch (error) {
      console.error('Error creating property:', error)
      throw error
    }
  }

  // Update property
  async updateProperty(id: string, updates: Partial<UpdatePropertyData>): Promise<Property> {
    try {
      const { data, error } = await this.supabase
        .from('properties')
        .update({
          ...(updates.title && { title: updates.title }),
          ...(updates.description && { description: updates.description }),
          ...(updates.location && { location: updates.location }),
          ...(updates.price && { price: updates.price }),
          ...(updates.property_type && { property_type: updates.property_type }),
          ...(updates.listing_type && { listing_type: updates.listing_type }),
          ...(updates.status && { status: updates.status }),
          ...(updates.features && { features: updates.features }),
          ...(updates.amenities && { amenities: updates.amenities }),
          ...(updates.tags && { tags: updates.tags }),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update property: ${error.message}`)
      }

      // Handle image updates if provided
      if (updates.image_files && updates.image_files.length > 0) {
        await this.uploadPropertyImages(id, updates.image_files, updates.hero_image_index)
      }

      // Fetch updated property
      const updatedProperty = await this.getProperty(id)
      if (!updatedProperty) {
        throw new Error('Failed to fetch updated property')
      }

      return updatedProperty

    } catch (error) {
      console.error('Error updating property:', error)
      throw error
    }
  }

  // Delete property
  async deleteProperty(id: string): Promise<void> {
    try {
      // Delete associated images first
      await this.supabase
        .from('property_images')
        .delete()
        .eq('property_id', id)

      // Delete metadata
      await this.supabase
        .from('property_metadata')
        .delete()
        .eq('property_id', id)

      // Delete property
      const { error } = await this.supabase
        .from('properties')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(`Failed to delete property: ${error.message}`)
      }

    } catch (error) {
      console.error('Error deleting property:', error)
      throw error
    }
  }

  // Update property status
  async updatePropertyStatus(id: string, status: Property['status']): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('properties')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) {
        throw new Error(`Failed to update property status: ${error.message}`)
      }

    } catch (error) {
      console.error('Error updating property status:', error)
      throw error
    }
  }

  // Increment property views
  async incrementPropertyViews(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .rpc('increment_property_views', { property_id: id })

      if (error) {
        console.error('Error incrementing views:', error)
        // Don't throw error for analytics failures
      }

    } catch (error) {
      console.error('Error incrementing property views:', error)
    }
  }

  // Private helper methods
  private transformDatabaseProperty(dbProperty: any): Property {
    return {
      id: dbProperty.id,
      title: dbProperty.title,
      description: dbProperty.description,
      location: dbProperty.location,
      price: dbProperty.price,
      property_type: dbProperty.property_type,
      listing_type: dbProperty.listing_type,
      status: dbProperty.status,
      features: dbProperty.features || {},
      amenities: dbProperty.amenities || [],
      tags: dbProperty.tags || [],
      agent_id: dbProperty.agent_id,
      owner_id: dbProperty.owner_id,
      images: dbProperty.images || [],
      hero_image: dbProperty.images?.find((img: any) => img.is_hero) || undefined,
      metadata: dbProperty.metadata?.[0] || {
        views: 0,
        inquiries: 0,
        favorites: 0,
        days_on_market: 0,
        price_history: []
      },
      seo: dbProperty.seo || {
        slug: this.generateSlug(dbProperty.title),
        meta_title: dbProperty.title,
        meta_description: dbProperty.description?.substring(0, 160)
      },
      created_at: dbProperty.created_at,
      updated_at: dbProperty.updated_at
    }
  }

  private async uploadPropertyImages(
    propertyId: string, 
    files: File[], 
    heroIndex: number = 0,
    uploadedBy: string // agent profile id
  ): Promise<void> {
    try {
      const imageRecords = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileName = `${propertyId}-${Date.now()}-${i}.${file.name.split('.').pop()}`
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await this.supabase.storage
          .from('property-images')
          .upload(fileName, file)

        if (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError.message}`)
        }

        // Get public URL
        const { data: { publicUrl } } = this.supabase.storage
          .from('property-images')
          .getPublicUrl(fileName)

        imageRecords.push({
          property_id: propertyId,
          url: publicUrl,
          alt_text: `${propertyId} image ${i + 1}`,
          is_hero: i === heroIndex,
          sort_order: i,
          uploaded_by: uploadedBy
        })
      }

      // Insert image records
      const { error: insertError } = await this.supabase
        .from('property_images')
        .insert(imageRecords)

      if (insertError) {
        throw new Error(`Failed to save image records: ${insertError.message}`)
      }

    } catch (error) {
      console.error('Error uploading property images:', error)
      throw error
    }
  }

  private async initializePropertyMetadata(propertyId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('property_metadata')
        .insert({
          property_id: propertyId,
          views: 0,
          inquiries: 0,
          favorites: 0,
          days_on_market: 0,
          price_history: []
        })

      if (error) {
        throw new Error(`Failed to initialize metadata: ${error.message}`)
      }

    } catch (error) {
      console.error('Error initializing property metadata:', error)
      throw error
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  // Mock data for development when database is not ready
  private getMockProperties(
    filters: PropertyFilters = {},
    page = 1,
    limit = 12
  ): PropertyListResponse {
    const mockProperties: Property[] = [
      {
        id: '1',
        title: 'Modern Villa in Georgetown',
        description: 'Beautiful 4-bedroom villa with modern amenities in the heart of Georgetown.',
        location: 'Georgetown, Guyana',
        price: 850000,
        property_type: 'house',
        listing_type: 'sale',
        status: 'available',
        features: {
          bedrooms: 4,
          bathrooms: 3,
          square_footage: 2500,
          parking_spaces: 2,
          year_built: 2020
        },
        images: [
          {
            id: '1',
            property_id: '1',
            url: '/images/house-linden.jpg',
            alt_text: 'Modern Villa Georgetown',
            is_hero: true,
            sort_order: 1,
            uploaded_by: 'agent1'
          }
        ],
        amenities: ['Swimming Pool', 'Garden', 'Security System'],
        tags: ['luxury', 'modern', 'georgetown'],
        agent_id: 'agent1',
        metadata: {
          views: 245,
          inquiries: 12,
          favorites: 18,
          days_on_market: 15,
          price_history: []
        },
        seo: {
          slug: 'modern-villa-georgetown',
          meta_title: 'Modern Villa in Georgetown - $850,000',
          meta_description: 'Beautiful 4-bedroom villa with modern amenities'
        },
        created_at: '2025-07-20T10:00:00Z',
        updated_at: '2025-07-22T10:00:00Z'
      },
      {
        id: '2',
        title: 'Luxury Apartment in New Amsterdam',
        description: 'Spacious 2-bedroom apartment with river views.',
        location: 'New Amsterdam, Berbice',
        price: 1200,
        property_type: 'apartment',
        listing_type: 'rent',
        status: 'available',
        features: {
          bedrooms: 2,
          bathrooms: 2,
          square_footage: 1200,
          parking_spaces: 1
        },
        images: [
          {
            id: '2',
            property_id: '2',
            url: '/images/apt-georgetown.jpg',
            alt_text: 'Luxury Apartment New Amsterdam',
            is_hero: true,
            sort_order: 1,
            uploaded_by: 'agent1'
          }
        ],
        amenities: ['River View', 'Balcony', 'Elevator'],
        tags: ['apartment', 'berbice', 'river-view'],
        agent_id: 'agent1',
        metadata: {
          views: 156,
          inquiries: 8,
          favorites: 12,
          days_on_market: 7,
          price_history: []
        },
        seo: {
          slug: 'luxury-apartment-new-amsterdam',
          meta_title: 'Luxury Apartment in New Amsterdam - $1,200/month',
          meta_description: 'Spacious 2-bedroom apartment with river views'
        },
        created_at: '2025-07-18T14:00:00Z',
        updated_at: '2025-07-22T10:00:00Z'
      },
      {
        id: '3',
        title: 'Commercial Space in Linden',
        description: 'Prime commercial location perfect for retail or office space.',
        location: 'Linden, Guyana',
        price: 500000,
        property_type: 'commercial',
        listing_type: 'sale',
        status: 'available',
        features: {
          square_footage: 1800,
          parking_spaces: 4
        },
        images: [
          {
            id: '3',
            property_id: '3',
            url: '/images/local-business.jpg',
            alt_text: 'Commercial Space Linden',
            is_hero: true,
            sort_order: 1,
            uploaded_by: 'agent1'
          }
        ],
        amenities: ['High Traffic Area', 'Parking', 'Security'],
        tags: ['commercial', 'linden', 'business'],
        agent_id: 'agent1',
        metadata: {
          views: 89,
          inquiries: 5,
          favorites: 7,
          days_on_market: 21,
          price_history: []
        },
        seo: {
          slug: 'commercial-space-linden',
          meta_title: 'Commercial Space in Linden - $500,000',
          meta_description: 'Prime commercial location perfect for retail or office'
        },
        created_at: '2025-07-15T09:00:00Z',
        updated_at: '2025-07-22T10:00:00Z'
      }
    ]

    // Apply basic filtering for demo
    let filteredProperties = mockProperties

    if (filters.property_type?.length) {
      filteredProperties = filteredProperties.filter(p => 
        filters.property_type!.includes(p.property_type)
      )
    }

    if (filters.listing_type?.length) {
      filteredProperties = filteredProperties.filter(p => 
        filters.listing_type!.includes(p.listing_type)
      )
    }

    if (filters.search_term) {
      const term = filters.search_term.toLowerCase()
      filteredProperties = filteredProperties.filter(p => 
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.location.toLowerCase().includes(term)
      )
    }

    const total = filteredProperties.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex)

    return {
      properties: paginatedProperties,
      total,
      page,
      limit,
      has_more: total > page * limit
    }
  }
}

// Export singleton instance
export const propertyRepository = new PropertyRepository()

