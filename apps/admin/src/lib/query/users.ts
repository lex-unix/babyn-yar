import { PUBLIC_API_URL } from '$env/static/public'
import { fetcher } from '$lib/fetcher'
import type { Metadata, User } from '$lib/types'
import { urlWithSearchParams } from '$lib/url-params'
import { queryClient } from '$query/client'
import {
  createMutation,
  type CreateQueryOptions,
  keepPreviousData,
  createQuery
} from '@tanstack/svelte-query'
import type { ResponseError } from 'shared'
import { derived, type Readable } from 'svelte/store'
type UsersResponse = {
  users: User[]
  metadata: Metadata
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

export function createUserSettingsMutation() {
  return createMutation<
    { user: User },
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

export function createMeQuery() {
  return createQuery<{ user: User }, ResponseError>({
    queryKey: ['me'],
    queryFn: () => fetcher(PUBLIC_API_URL + '/users/me'),
    retry: (failureCount, error) => {
      if (error.isUnauthorized()) return false
      return failureCount < 3
    }
  })
}
