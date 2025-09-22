// React Query Provider Setup - Modern State Management
// src/providers/AppProviders.tsx

'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

// Create a client with optimized settings for real estate platform
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time - how long data stays fresh (5 minutes for property data)
      staleTime: 5 * 60 * 1000,
      
      // Cache time - how long unused data stays in cache (10 minutes)
      gcTime: 10 * 60 * 1000,
      
      // Retry configuration for failed requests
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }
        // Retry up to 3 times for other errors
        return failureCount < 3
      },
      
      // Refetch on window focus for fresh data
      refetchOnWindowFocus: true,
      
      // Background refetch to keep data current
      refetchOnMount: true,
      
      // Network error handling
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      
      // Global error handling for mutations
      onError: (error: any) => {
        console.error('Mutation error:', error)
        // TODO: Add toast notification or global error handling
      },
    },
  },
})

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log to error reporting service
        console.error('React Error Boundary triggered:', error, errorInfo)
        
        // In production, send to error reporting service
        if (process.env.NODE_ENV === 'production') {
          // Example: Sentry.captureException(error, { extra: errorInfo })
        }
      }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        
        {/* React Query DevTools - only in development */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools
            initialIsOpen={false}
            position="bottom"
          />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

// Hook to access query client for manual invalidations
export function useQueryClient() {
  return queryClient
}

// Utility function to invalidate specific data
export const invalidateQueries = {
  // Invalidate all property queries
  allProperties: () => {
    queryClient.invalidateQueries({ queryKey: ['properties'] })
  },
  
  // Invalidate specific property
  property: (id: string) => {
    queryClient.invalidateQueries({ queryKey: ['properties', 'detail', id] })
  },
  
  // Invalidate agent properties
  agentProperties: (agentId: string) => {
    queryClient.invalidateQueries({ queryKey: ['properties', 'agent', agentId] })
  },
  
  // Invalidate property lists (search results)
  propertyLists: () => {
    queryClient.invalidateQueries({ queryKey: ['properties', 'list'] })
  },
  
  // Invalidate inquiries
  allInquiries: () => {
    queryClient.invalidateQueries({ queryKey: ['inquiries'] })
  },
  
  // Invalidate agent inquiries
  agentInquiries: (agentId: string) => {
    queryClient.invalidateQueries({ queryKey: ['inquiries', 'agent', agentId] })
  },
}

// Prefetch utilities for performance optimization
export const prefetchQueries = {
  // Prefetch popular properties
  popularProperties: async () => {
    await queryClient.prefetchQuery({
      queryKey: ['properties', 'list', { sort: { field: 'views', direction: 'desc' }, limit: 10 }],
      queryFn: () => {
        // TODO: Implement propertyRepository.getPopular()
        return Promise.resolve({ properties: [], total: 0 })
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
    })
  },
  
  // Prefetch property details on hover
  propertyDetails: async (id: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['properties', 'detail', id],
      queryFn: () => {
        // TODO: Implement propertyRepository.getById(id)
        return Promise.resolve(null)
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  },
}

// Cache utilities for optimistic updates
export const cacheUtils = {
  // Add new property to cache
  addProperty: (property: any) => {
    queryClient.setQueryData(['properties', 'detail', property.id], property)
    
    // Update any existing lists that might include this property
    queryClient.invalidateQueries({ queryKey: ['properties', 'list'] })
  },
  
  // Update property in cache
  updateProperty: (property: any) => {
    queryClient.setQueryData(['properties', 'detail', property.id], property)
    
    // Update lists
    queryClient.setQueriesData(
      { queryKey: ['properties', 'list'] },
      (oldData: any) => {
        if (!oldData?.properties) return oldData
        
        return {
          ...oldData,
          properties: oldData.properties.map((p: any) => 
            p.id === property.id ? property : p
          )
        }
      }
    )
  },
  
  // Remove property from cache
  removeProperty: (propertyId: string) => {
    queryClient.removeQueries({ queryKey: ['properties', 'detail', propertyId] })
    
    // Update lists to remove the property
    queryClient.setQueriesData(
      { queryKey: ['properties', 'list'] },
      (oldData: any) => {
        if (!oldData?.properties) return oldData
        
        return {
          ...oldData,
          properties: oldData.properties.filter((p: any) => p.id !== propertyId),
          total: Math.max(0, oldData.total - 1)
        }
      }
    )
  },
}
