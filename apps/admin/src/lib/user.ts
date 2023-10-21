import { PUBLIC_API_URL } from '$env/static/public'
import type { User } from './types'

const baseUrl = PUBLIC_API_URL + '/users'

export async function login(email: string, password: string) {
  const res = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    credentials: 'include'
  })

  const json = await res.json()

  if (res.ok) {
    const user: User = json.user
    return { ok: true as const, user }
  } else {
    const { error } = json
    return { ok: false as const, error }
  }
}

export async function deleteUsers(ids: number[]) {
  const url = new URL(baseUrl)
  url.searchParams.set('ids', ids.join(','))
  const res = await fetch(url, { method: 'DELETE', credentials: 'include' })
  return { ok: res.ok }
}
