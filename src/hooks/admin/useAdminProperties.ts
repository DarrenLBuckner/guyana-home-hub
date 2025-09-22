'use client'

// ADMIN SITE - Property Hooks with Full CRUD Operations
// src/hooks/admin/useAdminProperties.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUser } from '@/hooks/useUser'
import { propertyRepository } from '@/lib/repositories/propertyRepository'
import { 
  PropertyFilters, 
  PropertySortOptions, 
  CreatePropertyData, 
  UpdatePropertyData,
  Property 
} from '@/types/property'
import { useMemo, useState, useEffect } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

// ADMIN QUERY KEYS - Separate namespace to avoid cache conflicts with public
export const adminPropertyKeys = {
  all: ['admin-properties'] as const,
  lists: () => [...adminPropertyKeys.all, 'list'] as const,
  list: (filters: PropertyFilters, sort: PropertySortOptions, page: number) => 
    [...adminPropertyKeys.lists(), { filters, sort, page }] as const,
  details: () => [...adminPropertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminPropertyKeys.details(), id] as const,
  agent: (agentId: string) => [...adminPropertyKeys.all, 'agent', agentId] as const,
  pending: () => [...adminPropertyKeys.all, 'pending'] as const,
  analytics: () => [...adminPropertyKeys.all, 'analytics'] as const,
}

// Hook for admin property browsing - shows ALL properties (all statuses)
export function useAdminProperties(
  filters: PropertyFilters = {},
  sort: PropertySortOptions = { field: 'created_at', direction: 'desc' },
  page = 1,
  options: { enabled?: boolean } = {}
) {
  const user = useUser()

  return useQuery({
    queryKey: adminPropertyKeys.list(filters, sort, page),
    queryFn: () => propertyRepository.getProperties(filters, sort, page),
    enabled: !!user && options.enabled !== false, // Require authenticated user
    staleTime: 2 * 60 * 1000, // 2 minutes - shorter for admin (fresher data)
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    retry: (failureCount, error: any) => {
      // More aggressive retry for admin users
      if (error?.status >= 400 && error?.status < 500) {
        return false
      }
      return failureCount < 3
    }
  })
}

// Hook for fetching agent's properties with full access
export function useAgentProperties(
  agentId: string,
  filters: Omit<PropertyFilters, 'agent_id'> = {},
  sort: PropertySortOptions = { field: 'created_at', direction: 'desc' },
  page = 1
) {
  const user = useUser()
  
  return useQuery({
    queryKey: adminPropertyKeys.list({ ...filters, agent_id: agentId }, sort, page),
    queryFn: () => propertyRepository.getProperties({ ...filters, agent_id: agentId }, sort, page),
    enabled: !!user && !!agentId,
    staleTime: 1 * 60 * 1000, // 1 minute for agent's own data - very fresh
    gcTime: 3 * 60 * 1000,
  })
}

// Hook for admin property details - shows everything regardless of status
export function useAdminProperty(
  id: string, 
  options: { enabled?: boolean } = {}
) {
  const user = useUser()

  return useQuery({
    queryKey: adminPropertyKeys.detail(id),
    queryFn: () => propertyRepository.getProperty(id),
    enabled: !!user && !!id && options.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes for property details
    gcTime: 15 * 60 * 1000, // 15 minutes cache
  })
}

// Hook for creating property (admin/agent only)
export function useCreateProperty() {
  const queryClient = useQueryClient()
  const user = useUser()

  return useMutation({
    mutationFn: (data: CreatePropertyData) => {
      if (!user) {
        throw new Error('Authentication required to create properties')
      }
      return propertyRepository.createProperty(data)
    },
    onSuccess: (newProperty) => {
      // Invalidate and refetch all admin property queries
      queryClient.invalidateQueries({ queryKey: adminPropertyKeys.lists() })
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: adminPropertyKeys.agent(user.id) })
      }
      
      // Add the new property to cache
      queryClient.setQueryData(
        adminPropertyKeys.detail(newProperty.id),
        newProperty
      )
      
      console.log('Property created successfully:', newProperty.title)
    },
    onError: (error) => {
      console.error('Failed to create property:', error)
    }
  })
}

// Hook for updating property (admin/agent only)
export function useUpdateProperty() {
  const queryClient = useQueryClient()
  const user = useUser()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdatePropertyData> }) => {
      if (!user) {
        throw new Error('Authentication required to update properties')
      }
      return propertyRepository.updateProperty(id, data)
    },
    onSuccess: (updatedProperty) => {
      // Update specific property in cache
      queryClient.setQueryData(
        adminPropertyKeys.detail(updatedProperty.id),
        updatedProperty
      )
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: adminPropertyKeys.lists() })
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: adminPropertyKeys.agent(user.id) })
      }
      
      console.log('Property updated successfully:', updatedProperty.title)
    },
    onError: (error) => {
      console.error('Failed to update property:', error)
    }
  })
}

// Hook for deleting property (admin only)
export function useDeleteProperty() {
  const queryClient = useQueryClient()
  const user = useUser()

  return useMutation({
    mutationFn: (id: string) => {
      if (!user) {
        throw new Error('Authentication required to delete properties')
      }
      return propertyRepository.deleteProperty(id)
    },
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: adminPropertyKeys.detail(deletedId) })
      
      // Invalidate all lists
      queryClient.invalidateQueries({ queryKey: adminPropertyKeys.lists() })
      console.log('Property deleted successfully')
    },
    onError: (error) => {
      console.error('Failed to delete property:', error)
    }
  })
}

// Hook for updating property status (admin only)
export function useUpdatePropertyStatus() {
  const queryClient = useQueryClient()
  const user = useUser()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Property['status'] }) => {
      if (!user) {
        throw new Error('Authentication required to update property status')
      }
      return propertyRepository.updatePropertyStatus(id, status)
    },
    onSuccess: (_, { id, status }) => {
      // Optimistic update
      queryClient.setQueryData(
        adminPropertyKeys.detail(id),
        (old: Property | undefined) => old ? { ...old, status } : undefined
      )
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: adminPropertyKeys.lists() })
      console.log(`Property status updated to: ${status}`)
    },
    onError: (error) => {
      console.error('Failed to update property status:', error)
    }
  })
}

// Hook for admin property search with comprehensive filtering
export function useAdminPropertySearch(initialFilters: PropertyFilters = {}) {
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters)
  const [sort, setSort] = useState<PropertySortOptions>({ field: 'created_at', direction: 'desc' })
  const [page, setPage] = useState(1)
  
  // Shorter debounce for admin users (they expect faster response)
  const debouncedSearchTerm = useDebounce(filters.search_term, 200)
  
  const debouncedFilters = useMemo(() => ({
    ...filters,
    search_term: debouncedSearchTerm
    // NOTE: No status filtering - admin can see all statuses
  }), [filters, debouncedSearchTerm])

  const query = useAdminProperties(debouncedFilters, sort, page)

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [debouncedFilters, sort])

  const updateFilters = (newFilters: Partial<PropertyFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({})
    setPage(1)
  }

  const nextPage = () => {
    if (query.data?.has_more) {
      setPage(prev => prev + 1)
    }
  }

  const previousPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1)
    }
  }

  return {
    // Data
    ...query,
    properties: query.data?.properties || [],
    total: query.data?.total || 0,
    hasMore: query.data?.has_more || false,
    
    // State
    filters: debouncedFilters,
    sort,
    page,
    
    // Actions
    updateFilters,
    clearFilters,
    setSort,
    setPage,
    nextPage,
    previousPage,
  }
}

// Admin-specific filter presets (includes all statuses)
export const adminPropertyFilterPresets = {
  all: (): PropertyFilters => ({}),
  pending: (): PropertyFilters => ({ status: ['pending'] }),
  approved: (): PropertyFilters => ({ status: ['available'] }),
  rejected: (): PropertyFilters => ({ status: ['off_market'] }),
  sold: (): PropertyFilters => ({ status: ['sold'] }),
  rented: (): PropertyFilters => ({ status: ['rented'] }),
  forSale: (): PropertyFilters => ({ listing_type: ['sale'] }),
  forRent: (): PropertyFilters => ({ listing_type: ['rent'] }),
  residential: (): PropertyFilters => ({ property_type: ['house', 'apartment', 'condo'] }),
  commercial: (): PropertyFilters => ({ property_type: ['commercial'] }),
  land: (): PropertyFilters => ({ property_type: ['land'] }),
}
// Admin-specific sort presets
export const adminPropertySortPresets = {
  newest: (): PropertySortOptions => ({ field: 'created_at', direction: 'desc' }),
  oldest: (): PropertySortOptions => ({ field: 'created_at', direction: 'asc' }),
  priceHighToLow: (): PropertySortOptions => ({ field: 'price', direction: 'desc' }),
  priceLowToHigh: (): PropertySortOptions => ({ field: 'price', direction: 'asc' }),
  mostViewed: (): PropertySortOptions => ({ field: 'views', direction: 'desc' }),
  recentlyUpdated: (): PropertySortOptions => ({ field: 'updated_at', direction: 'desc' }),
}






