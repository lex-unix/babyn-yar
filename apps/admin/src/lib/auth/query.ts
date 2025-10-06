import {
  createMutation,
  createQuery,
  useQueryClient
} from '@tanstack/svelte-query'
import { ResponseError } from '$lib/response-error'
import { fetchLoggedUser, login, register } from './api'
import { userKeys } from '$lib/users/query'
import type { Login, RegisterUser } from './schema'
import { authToasts } from './toast'

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const
}

export function useRegister() {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: (newUser: RegisterUser) => register(newUser),
    onSettled: () => {
      client.invalidateQueries({ queryKey: userKeys.all })
    },
    onSuccess: () => {
      authToasts.registerSuccess()
    }
  }))
}

export function useLogin() {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: (credentials: Login) => login(credentials),
    onSuccess: loggedUser => {
      client.setQueryData(authKeys.me(), loggedUser.user)
    }
  }))
}

export function useLoggedUser() {
  return createQuery(() => ({
    queryKey: authKeys.me(),
    refetchInterval: 1000 * 60 * 5,
    refetchIntervalInBackground: true,
    queryFn: () => fetchLoggedUser(),
    retry: (failureCount, error) => {
      if (error instanceof ResponseError && error.isUnauthorized()) {
        return false
      }
      return failureCount < 3
    }
  }))
}
