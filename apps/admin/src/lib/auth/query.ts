import { createMutation, createQuery } from '@tanstack/svelte-query'
import { ResponseError } from '$lib/response-error'
import { queryClient } from '$lib/query/client'
import { fetchLoggedUser, login, register } from './api'
import { userKeys } from '$lib/users/query'
import { addToast } from '$components/Toaster.svelte'
import { authToasts } from './toast'
import { currentUser } from './store'
import { goto } from '$app/navigation'
import { get } from 'svelte/store'
import type { PaginatedUsersResponse } from '$lib/users/schema'
import { urlFilters } from '$lib/url-params'
import type { Login, RegisterUser } from './schema'

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const
}

export function useRegister() {
  return createMutation({
    mutationFn: (newUser: RegisterUser) => register(newUser),
    onSuccess: response => {
      addToast(authToasts.registerSuccess)
      queryClient.setQueryData(
        userKeys.table(get(urlFilters)),
        (data: PaginatedUsersResponse) => ({
          metadata: data.metadata,
          users: [response.user, ...data.users]
        })
      )
    }
  })
}

export function useLogin() {
  return createMutation({
    mutationFn: (credentials: Login) => login(credentials),
    onSuccess: loggedUser => {
      queryClient.setQueryData(authKeys.me(), loggedUser.user)
      currentUser.set(loggedUser.user)
      goto('/content')
    },
    onError: error => {
      if (error instanceof ResponseError && error.isUnauthorized()) {
        addToast(authToasts.credentialsError)
      }
    }
  })
}

export function useLoggedUser() {
  return createQuery({
    queryKey: authKeys.me(),
    queryFn: () => fetchLoggedUser(),
    retry: (failureCount, error) => {
      if (error instanceof ResponseError && error.isUnauthorized()) {
        return false
      }
      return failureCount < 3
    }
  })
}
