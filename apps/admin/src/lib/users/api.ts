import { PUBLIC_API_URL } from '$env/static/public'
import { fetcher } from '$lib/fetcher'
import { parse } from 'valibot'
import { PaginatedUsersResponse, Settings, UserResponse } from './schema'

export async function fetchUsers(params: string) {
  const response = await fetcher(`${PUBLIC_API_URL}/users?${params}`)
  return parse(PaginatedUsersResponse, response)
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
