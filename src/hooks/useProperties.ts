'use client'

// Modern React Query Hooks - Industry Standard Pattern
// src/hooks/useProperties.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUser } from '@supabase/auth-helpers-react'
import { propertyRepository } from '@/lib/repositories/propertyRepository'
import { 
  PropertyFilters, 
  PropertySortOptions, 
  CreatePropertyData, 
  UpdatePropertyData,
  Property 
} from '@/types/property'

// Query Keys - Centralized for consistency
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters: PropertyFilters, sort: PropertySortOptions, page: number) => 
    [...propertyKeys.lists(), { filters, sort, page }] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
  agent: (agentId: string) => [...propertyKeys.all, 'agent', agentId] as const,
}

// Hook for fetching properties with filters
export function useProperties(
  filters: PropertyFilters = {},
  sort: PropertySortOptions = { field: 'created_at', direction: 'desc' },
  page = 1,
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: propertyKeys.list(filters, sort, page),
    queryFn: () => propertyRepository.getProperties(filters, sort, page),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options.enabled !== false,
  })
}

// Hook for fetching agent's properties
export function useAgentProperties(
  agentId: string,
  filters: Omit<PropertyFilters, 'agent_id'> = {},
  sort: PropertySortOptions = { field: 'created_at', direction: 'desc' },
  page = 1
) {
  const user = useUser()
  
  return useQuery({
    queryKey: propertyKeys.list({ ...filters, agent_id: agentId }, sort, page),
    queryFn: () => propertyRepository.getProperties({ ...filters, agent_id: agentId }, sort, page),
    enabled: !!user && !!agentId,
    staleTime: 2 * 60 * 1000, // 2 minutes for agent's own data
  })
}

// Hook for fetching single property
export function useProperty(id: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => propertyRepository.getProperty(id),
    enabled: !!id && options.enabled !== false,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook for creating property
export function useCreateProperty() {
  const queryClient = useQueryClient()
  const user = useUser()

  return useMutation({
    mutationFn: (data: CreatePropertyData) => propertyRepository.createProperty(data),
    onSuccess: (newProperty) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() })
      
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: propertyKeys.agent(user.id) })
      }
      
      // Add the new property to cache
      queryClient.setQueryData(
        propertyKeys.detail(newProperty.id),
        newProperty
      )
    },
    onError: (error) => {
      console.error('Failed to create property:', error)
    }
  })
}

// Hook for updating property
export function useUpdateProperty() {
  const queryClient = useQueryClient()
  const user = useUser()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdatePropertyData> }) =>
      propertyRepository.updateProperty(id, data),
    onSuccess: (updatedProperty) => {
      // Update specific property in cache
      queryClient.setQueryData(
        propertyKeys.detail(updatedProperty.id),
        updatedProperty
      )
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() })
      
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: propertyKeys.agent(user.id) })
      }
    },
    onError: (error) => {
      console.error('Failed to update property:', error)
    }
  })
}

// Hook for deleting property
export function useDeleteProperty() {
  const queryClient = useQueryClient()
  const user = useUser()

  return useMutation({
    mutationFn: (id: string) => propertyRepository.deleteProperty(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: propertyKeys.detail(deletedId) })
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() })
      
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: propertyKeys.agent(user.id) })
      }
    },
    onError: (error) => {
      console.error('Failed to delete property:', error)
    }
  })
}

// Hook for updating property status
export function useUpdatePropertyStatus() {
  const queryClient = useQueryClient()
  const user = useUser()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Property['status'] }) =>
      propertyRepository.updatePropertyStatus(id, status),
    onSuccess: (_, { id, status }) => {
      // Optimistic update
      queryClient.setQueryData(
        propertyKeys.detail(id),
        (old: Property | undefined) => old ? { ...old, status } : undefined
      )
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() })
      
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: propertyKeys.agent(user.id) })
      }
    },
    onError: (error) => {
      console.error('Failed to update property status:', error)
    }
  })
}

// Hook for analytics - increment views
export function useIncrementPropertyViews() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => propertyRepository.incrementPropertyViews(id),
    onSuccess: (_, id) => {
      // Optimistic update for views
      queryClient.setQueryData(
        propertyKeys.detail(id),
        (old: Property | undefined) => {
          if (!old) return undefined
          return {
            ...old,
            metadata: {
              ...old.metadata,
              views: old.metadata.views + 1
            }
          }
        }
      )
    }
  })
}

// Custom hook for property search with debouncing
import { useMemo, useState, useEffect } from 'react'
import { useDebounce } from './useDebounce'

export function usePropertySearch(initialFilters: PropertyFilters = {}) {
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters)
  const [sort, setSort] = useState<PropertySortOptions>({ field: 'created_at', direction: 'desc' })
  const [page, setPage] = useState(1)
  
  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(filters.search_term, 300)
  
  const debouncedFilters = useMemo(() => ({
    ...filters,
    search_term: debouncedSearchTerm
  }), [filters, debouncedSearchTerm])

  const query = useProperties(debouncedFilters, sort, page)

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

// Export common filter presets
export const propertyFilterPresets = {
  forSale: (): PropertyFilters => ({ listing_type: ['sale'], status: ['available'] }),
  forRent: (): PropertyFilters => ({ listing_type: ['rent'], status: ['available'] }),
  residential: (): PropertyFilters => ({ property_type: ['house', 'apartment', 'condo'] }),
  commercial: (): PropertyFilters => ({ property_type: ['commercial'] }),
  recentlyAdded: (): PropertyFilters => ({ status: ['available'] }),
}

// Export common sort presets
export const propertySortPresets = {
  newest: (): PropertySortOptions => ({ field: 'created_at', direction: 'desc' }),
  oldest: (): PropertySortOptions => ({ field: 'created_at', direction: 'asc' }),
  priceHighToLow: (): PropertySortOptions => ({ field: 'price', direction: 'desc' }),
  priceLowToHigh: (): PropertySortOptions => ({ field: 'price', direction: 'asc' }),
  mostViewed: (): PropertySortOptions => ({ field: 'views', direction: 'desc' }),
}
