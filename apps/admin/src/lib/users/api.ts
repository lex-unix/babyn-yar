import { PUBLIC_API_URL } from '$env/static/public'
import { fetcher } from '$lib/fetcher'
import { parse } from 'valibot'
import { Settings, User, UserFilters, UserResponse } from './schema'
import type { Metadata } from '$lib/pagination/schema'

export async function fetchUsers(
  filters: UserFilters
): Promise<{ users: User[]; metadata: Metadata }> {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null) {
      const s = String(value)
      if (s !== '') {
        params.set(key, s)
      }
    }
  }

  const url = new URL('/v1/users', PUBLIC_API_URL)
  url.search = params.toString()

  return fetcher(url.toString())
}

export async function deleteUsers(ids: number[]) {
  return fetcher(PUBLIC_API_URL + `/users?ids=${ids.join(',')}`, {
    method: 'DELETE'
  })
}

export async function updateSettings(settings: Settings) {
  const body = { ...settings }
  for (const [key, value] of Object.entries(settings)) {
    if (!value) {
      delete body[key as keyof Settings]
    }
  }

  const response = await fetcher(PUBLIC_API_URL + '/users', {
    method: 'PATCH',
    body: JSON.stringify(body)
  })

  return parse(UserResponse, response)
}
