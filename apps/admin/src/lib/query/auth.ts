import { PUBLIC_API_URL } from '$env/static/public'
import { fetcher } from '$lib/fetcher'
import type { User } from '$lib/types'
import { createMutation } from '@tanstack/svelte-query'
import type { ResponseError } from 'shared'
import { queryClient } from './client'

export function useRegister() {
  return createMutation<
    { user: User },
    ResponseError,
    { fullName: string; email: string; password: string; permission: string }
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

export function useLogin() {
  return createMutation<
    { user: User },
    ResponseError,
    { email: string; password: string }
  >({
    mutationFn: data => {
      return fetcher(PUBLIC_API_URL + '/users/login', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    }
  })
}
