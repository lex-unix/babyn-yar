import { queryClient } from '$query/client'
import {
  createMutation,
  keepPreviousData,
  createQuery
} from '@tanstack/svelte-query'
import { ResponseError } from '$lib/response-error'
import { derived, get } from 'svelte/store'
import { urlFilters } from '$lib/url-params'
import { currentUser } from '$lib/auth/store'
import { deleteUsers, fetchUsers, updateSettings } from './api'
import { addToast } from '$components/Toaster.svelte'
import { userToasts } from './toast'
import type { PaginatedUsersResponse, Settings } from './schema'

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
        queryFn: ({ queryKey }: { queryKey: string[] }) => {
          return fetchUsers(queryKey[1] as string)
        }
      }
    })
  )
}

export function useDeleteUsers() {
  return createMutation({
    mutationFn: (ids: number[]) => {
      return deleteUsers(ids)
    },
    onSuccess: (_, deletedIds) => {
      addToast(userToasts.deleteUsersSuccess)
      queryClient.setQueryData(userKeys.table(get(urlFilters)), (data: PaginatedUsersResponse) => ({
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
  return createMutation({
    mutationFn: (settings: Settings) => {
      return updateSettings(settings)
    },
    onSuccess: response => {
      currentUser.set(response.user)
      addToast(userToasts.updateSettingsSuccess)
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
    onError: (error) => {
      if (error instanceof ResponseError && error.isServerError()) {
        addToast(userToasts.updateSettingsError)
      }
    }
  })
}
