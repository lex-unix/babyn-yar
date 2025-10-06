import { queryClient } from '$query/client'
import {
  createMutation,
  keepPreviousData,
  createQuery,
  useQueryClient
} from '@tanstack/svelte-query'
import { deleteUsers, fetchUsers, updateSettings } from './api'
import type { PaginatedUsersResponse, Settings, UserFilters } from './schema'
import { userToasts } from './toast'
import { authKeys } from '$lib/auth/query'
import { useUserFilters } from '$lib/use-user-filters'

export const userKeys = {
  all: ['users'] as const,
  table: (filters: UserFilters) => [...userKeys.all, filters]
}

export function useUsers() {
  const filters = useUserFilters()

  return createQuery(() => ({
    queryKey: userKeys.table(filters.current),
    queryFn: () => {
      return fetchUsers(filters.current)
    },
    placeholderData: keepPreviousData
  }))
}

export function useDeleteUsers() {
  const filters = useUserFilters()
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: async (userIds: number[]) => {
      await new Promise(res => setTimeout(res, 1500))
      return deleteUsers(userIds)
    },
    onMutate: async userIds => {
      await client.cancelQueries({ queryKey: userKeys.all })
      const prevUsers = client.getQueryData<PaginatedUsersResponse>(
        userKeys.table(filters.current)
      )

      if (!prevUsers) return

      client.setQueryData<PaginatedUsersResponse>(
        userKeys.table(filters.current),
        old => {
          if (!old) return old
          return {
            ...old,
            users: old.users.filter(user => !userIds.includes(user.id))
          }
        }
      )

      return { prevUsers }
    },
    onSettled: () => {
      client.invalidateQueries({ queryKey: userKeys.all })
    },
    onSuccess: () => {
      userToasts.deleteUsersSuccess()
    },
    onError: (error, _userIds, context) => {
      console.error(error)
      userToasts.deleteUsersError()
      if (context?.prevUsers) {
        client.setQueryData(userKeys.all, context.prevUsers)
      }
    }
  }))
}

export function useUpdateSettings() {
  return createMutation(() => ({
    mutationFn: (settings: Settings) => {
      return updateSettings(settings)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
      queryClient.invalidateQueries({ queryKey: authKeys.me() })
    }
  }))
}
