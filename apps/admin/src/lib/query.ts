import { PUBLIC_API_URL } from '$env/static/public'
import {
  createInfiniteQuery,
  createMutation,
  type CreateInfiniteQueryOptions,
  type InfiniteData,
  QueryClient
} from '@tanstack/svelte-query'
import type { Metadata } from 'shared-types'
import { derived, type Writable } from 'svelte/store'
import type { Asset } from './types'
import { ResponseError } from './response-error'
import { browser } from '$app/environment'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: browser
    }
  }
})

type AssetsResponse = {
  assets: Asset[]
  metadata: Metadata
}

export async function fetchAssets(params: Record<string, string>) {
  const url = new URL(PUBLIC_API_URL + `/assets?page_size=50`)
  for (const param in params) {
    if (params[param]) {
      url.searchParams.set(param, params[param])
    }
  }
  const response = await fetch(url, { credentials: 'include' })
  if (!response.ok) {
    try {
      const { error } = await response.json()
      throw new ResponseError(response.status, error)
    } catch (error) {
      throw new ResponseError(response.status, response.statusText)
    }
  }
  return response.json()
}

export function createAssetsQuery(filters: Writable<Record<string, string>>) {
  return createInfiniteQuery(
    derived(filters, $filters => {
      return {
        initialPageParam: 1,
        queryKey: [
          'assets',
          {
            sort: $filters.sort,
            filename: $filters.search,
            content_type: $filters.contentType || ''
          }
        ],
        queryFn: async ({ pageParam = 1, queryKey }) => {
          return fetchAssets({
            ...(queryKey[1] as Record<string, string>),
            page: (pageParam as number).toString()
          })
        },
        getNextPageParam: lastPage => {
          if (lastPage.metadata.currentPage >= lastPage.metadata.lastPage) {
            return undefined
          }
          return lastPage.metadata.currentPage + 1
        }
      } as CreateInfiniteQueryOptions<
        AssetsResponse,
        Error,
        InfiniteData<AssetsResponse>
      >
    })
  )
}

export function createUploadAssetMutation() {
  return createMutation<Record<string, string>, ResponseError, FormData>({
    mutationFn: async formData => {
      const response = await fetch(PUBLIC_API_URL + '/assets', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })
      if (!response.ok) {
        const { error } = await response.json()
        throw new ResponseError(response.status, error)
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    }
  })
}

export function createDeleteAssetsMutation() {
  return createMutation<Record<string, string>, ResponseError, number[]>({
    mutationFn: async ids => {
      const url = new URL(PUBLIC_API_URL + '/assets')
      url.searchParams.set('ids', ids.join(','))
      const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (!response.ok) {
        const { error } = await response.json()
        throw new ResponseError(response.status, error)
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    }
  })
}
