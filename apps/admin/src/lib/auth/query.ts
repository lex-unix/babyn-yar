import type { User } from '$lib/types'
import { createMutation, createQuery } from '@tanstack/svelte-query'
import type { ResponseError } from '$lib/response-error'
import { queryClient } from '$lib/query/client'
import { fetchLoggedUser, login, register } from './api'
import { userKeys } from '$lib/users/query'
import { addToast } from '$components/Toaster.svelte'
import { authToasts } from './toast'
import { currentUser } from './store'
import { goto } from '$app/navigation'
import { get } from 'svelte/store'
import type { UsersResponse } from '$lib/users/query'
import { urlFilters } from '$lib/url-params'

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const
}

export function useRegister() {
  return createMutation<
    { user: User },
    ResponseError,
    { fullName: string; email: string; password: string; permission: string }
  >({
    mutationFn: async newUser => register(newUser),
    onSuccess: response => {
      addToast(authToasts.registerSuccess)
      queryClient.setQueryData(
        userKeys.table(get(urlFilters)),
        (data: UsersResponse) => ({
          metadata: data.metadata,
          users: [response.user, ...data.users]
        })
      )
    }
  })
}

export function useLogin() {
  return createMutation<
    { user: User },
    ResponseError,
    { email: string; password: string }
  >({
    mutationFn: credentials => login(credentials),
    onSuccess: loggedUser => {
      queryClient.setQueryData(authKeys.me(), loggedUser.user)
      currentUser.set(loggedUser.user)
      goto('/content')
    },
    onError: error => {
      if (error.isUnauthorized()) {
        addToast(authToasts.credentialsError)
      }
    }
  })
}

export function useLoggedUser() {
  return createQuery<{ user: User }, ResponseError>({
    queryKey: authKeys.me(),
    queryFn: () => fetchLoggedUser(),
    retry: (failureCount, error) => {
      if (error.isUnauthorized()) return false
      return failureCount < 3
    }
  })
}
