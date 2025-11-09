'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

/**
 * React Query Provider Configuration
 *
 * Provides TanStack Query client to the application with optimal
 * configuration for server data management and caching.
 */

interface QueryProviderProps {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Create a new QueryClient instance for each request
  // This prevents data sharing between different users and requests
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Time in milliseconds that data remains fresh
            staleTime: 5 * 60 * 1000, // 5 minutes

            // Time in milliseconds that inactive queries will remain in cache
            gcTime: 10 * 60 * 1000, // 10 minutes

            // Retry failed requests up to 3 times
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx client errors
              if (error?.status >= 400 && error?.status < 500) {
                return false
              }
              return failureCount < 3
            },

            // Retry delay with exponential backoff
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

            // Don't refetch on window focus by default (better UX)
            refetchOnWindowFocus: false,

            // Refetch on reconnect to network
            refetchOnReconnect: true,

            // Refetch on component mount if data is stale
            refetchOnMount: true,

            // Enable background refetching
            refetchIntervalInBackground: false,

            // Scroll to top on refetch for list queries
            // (handled by individual components)
          },

          mutations: {
            // Retry mutations on failure
            retry: 1,

            // Mutation retry delay
            retryDelay: 1000,

            // Don't throw errors by default (handle them in components)
            throwOnError: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools
        initialIsOpen={false}
        buttonPosition="bottom-right"
        position="bottom"
      />
    </QueryClientProvider>
  )
}

/**
 * Query Client Provider for Server Components
 *
 * This is used in server components where we don't need devtools
 */
export function ServerQueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

/**
 * Hook to get the Query Client instance
 */
export function useQueryClient() {
  return QueryClientProvider.useQueryClient()
}

export default QueryProvider