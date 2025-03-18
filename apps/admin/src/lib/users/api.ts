import { PUBLIC_API_URL } from '$env/static/public'
import { fetcher } from '$lib/fetcher'

export async function fetchUsers(params: string) {
  return fetcher(`${PUBLIC_API_URL}/users?${params}`)
}

export async function deleteUsers(ids: number[]) {
  return fetcher(PUBLIC_API_URL + `/users?ids=${ids.join(',')}`, {
    method: 'DELETE'
  })
}

export async function updateSettings(settings: {
  fullName: string
  email: string
  password: string
}) {
  const body: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(settings)) {
    if (value) body[key] = value
  }
  return fetcher(PUBLIC_API_URL + '/users', {
    method: 'PATCH',
    body: JSON.stringify(body)
  })
}
