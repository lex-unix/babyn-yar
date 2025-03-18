import type { Metadata, User } from '$lib/types'
import { queryClient } from '$query/client'
import {
  createMutation,
  type CreateQueryOptions,
  keepPreviousData,
  createQuery
} from '@tanstack/svelte-query'
import type { ResponseError } from '$lib/response-error'
import { derived, get } from 'svelte/store'
import { urlFilters } from '$lib/url-params'
import { currentUser } from '$lib/auth/store'
import { deleteUsers, fetchUsers, updateSettings } from './api'
import { addToast } from '$components/Toaster.svelte'
import { userToasts } from './toast'

export type UsersResponse = {
  users: User[]
  metadata: Metadata
}

export const userKeys = {
  all: ['users'] as const,
  table: (filters: string) => [...userKeys.all, filters]
}

export function useUsers() {
  return createQuery(
    derived(urlFilters, $filters => {
      return {
        placeholderData: keepPreviousData,
        queryKey: userKeys.table($filters),
        queryFn: ({ queryKey }) => {
          return fetchUsers(queryKey[1] as string)
        }
      } as CreateQueryOptions<UsersResponse, ResponseError>
    })
  )
}

export function useDeleteUsers() {
  return createMutation<Record<string, string>, ResponseError, number[]>({
    mutationFn: ids => {
      return deleteUsers(ids)
    },
    onSuccess: (_, deletedIds) => {
      addToast(userToasts.deleteUsersSuccess)
      queryClient.setQueryData(
        userKeys.table(get(urlFilters)),
        (data: UsersResponse) => ({
          metadata: data.metadata,
          users: data.users.filter(user => !deletedIds.includes(user.id))
        })
      )
      queryClient.invalidateQueries({
        queryKey: userKeys.all,
        refetchType: 'none'
      })
    },
    onError: () => {
      addToast(userToasts.deleteUsersError)
    }
  })
}

export function useUpdateSettings() {
  return createMutation<
    { user: User },
    ResponseError,
    { fullName: string; email: string; password: string }
  >({
    mutationFn: settings => {
      return updateSettings(settings)
    },
    onSuccess: resonse => {
      currentUser.set(resonse.user)
      addToast(userToasts.updateSettingsSuccess)
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
    onError: () => {
      addToast(userToasts.updateSettingsError)
    }
  })
}
