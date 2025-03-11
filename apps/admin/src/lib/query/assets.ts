import { PUBLIC_API_URL } from '$env/static/public'
import { fetcher } from '$lib/fetcher'
import type { Asset, Metadata } from '$lib/types'
import { urlWithSearchParams } from '$lib/url-params'
import { queryClient } from '$query/client'
import {
  createInfiniteQuery,
  createMutation,
  type CreateInfiniteQueryOptions,
  type InfiniteData
} from '@tanstack/svelte-query'
import { ResponseError } from 'shared'
import { derived, type Writable } from 'svelte/store'

type AssetsResponse = {
  assets: Asset[]
  metadata: Metadata
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
          return fetcher(
            urlWithSearchParams(PUBLIC_API_URL + '/assets?page_size=50', {
              ...(queryKey[1] as Record<string, string>),
              page: (pageParam as number).toString()
            })
          )
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
      return fetcher(PUBLIC_API_URL + '/assets', {
        method: 'POST',
        body: formData
      })
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
