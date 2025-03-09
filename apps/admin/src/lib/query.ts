import { PUBLIC_API_URL } from '$env/static/public'
import {
  createInfiniteQuery,
  createMutation,
  type CreateInfiniteQueryOptions,
  type InfiniteData,
  QueryClient,
  createQuery,
  keepPreviousData,
  type CreateQueryOptions
} from '@tanstack/svelte-query'
import type { Event, Metadata } from './types'
import { derived, type Readable, type Writable } from 'svelte/store'
import type { Asset } from './types'
import { ResponseError } from './response-error'
import { browser } from '$app/environment'
import type { User } from 'shared-types'
import { urlWithSearchParams } from './url-params'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

const DEFAULT_REQUEST_OPTS: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
}

export async function fetcher(url: URL | string, opts: RequestInit = {}) {
  const response = await fetch(url, { ...DEFAULT_REQUEST_OPTS, ...opts })
  if (!response.ok) {
    let responseError: string | Record<string, string>
    try {
      const { error } = await response.json()
      responseError = error
    } catch (error) {
      responseError = response.statusText
    }
    throw new ResponseError(response.status, responseError)
  }
  return response.json()
}

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

type ContentResponse = {
  events: Event[]
  metadata: Metadata
}

type UsersResponse = {
  users: User[]
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

export function createUsersQuery(
  filters: Readable<Record<string, string | number>>
) {
  return createQuery(
    derived(filters, $filters => {
      return {
        placeholderData: keepPreviousData,
        queryKey: [
          'users',
          { page: $filters.page, page_size: $filters.pageSize }
        ],
        queryFn: ({ queryKey }) => {
          return fetcher(
            urlWithSearchParams(
              PUBLIC_API_URL + '/users',
              queryKey[1] as Record<string, string | number>
            )
          )
        }
      } as CreateQueryOptions<UsersResponse, ResponseError>
    })
  )
}

export function createUsersDeleteMutation() {
  return createMutation<Record<string, string>, ResponseError, number[]>({
    mutationFn: ids => {
      return fetcher(PUBLIC_API_URL + `/users?ids=${ids.join(',')}`, {
        method: 'DELETE'
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}

export function createRegisterMutation() {
  return createMutation<
    { user: User },
    ResponseError,
    { fullName: string; email: string; password: string }
  >({
    mutationFn: async data => {
      return fetcher(PUBLIC_API_URL + '/users/register', {
        body: JSON.stringify(data),
        method: 'POST'
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}

export function createContentQuery(
  filters: Readable<Record<string, string | number>>
) {
  return createQuery<ContentResponse, ResponseError>(
    derived(filters, $filters => {
      return {
        placeholderData: keepPreviousData,
        queryKey: [
          'content',
          {
            page: $filters.page,
            page_size: $filters.pageSize,
            sort: $filters.sort,
            title: $filters.search
          }
        ],
        queryFn: async ({ queryKey }) => {
          const url = new URL(PUBLIC_API_URL + '/events')
          const params = queryKey[1] as Record<string, string | number>
          for (const param in params) {
            if (params[param]) {
              url.searchParams.set(param, params[param].toString())
            }
          }
          const response = await fetch(url)
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
      } as CreateQueryOptions<ContentResponse, ResponseError>
    })
  )
}

export function createUserSettingsMutation() {
  return createMutation<
    Record<string, string>,
    ResponseError,
    { fullName: string; email: string; password: string }
  >({
    mutationFn: data => {
      const body: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(data)) {
        if (value) body[key] = value
      }
      return fetcher(PUBLIC_API_URL + '/users', {
        method: 'PATCH',
        body: JSON.stringify(body)
      })
    }
  })
}

export function createContentdDeleteMutation() {
  return createMutation<Record<string, string>, ResponseError, number[]>({
    mutationFn: async ids => {
      const response = await fetch(
        PUBLIC_API_URL + `/events?ids=${ids.join(',')}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      )
      if (!response.ok) {
        try {
          const { error } = await response.json()
          throw new ResponseError(response.status, error)
        } catch (error) {
          throw new ResponseError(response.status, response.statusText)
        }
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
    }
  })
}
