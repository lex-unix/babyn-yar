import { PUBLIC_API_URL } from '$env/static/public'
import type { Metadata, User } from './types'
import { ResponseError } from './response-error'

type PaginatedResponse = {
  users: User[]
  metadata: Metadata
}

const baseUrl = PUBLIC_API_URL + '/users'

export function fetchUsersWrapper() {
  const url = new URL(baseUrl)
  const searchParams = new URLSearchParams()
  searchParams.set('page_size', '10')

  return async (page: number = 1) => {
    try {
      searchParams.set('page', `${page}`)
      url.search = searchParams.toString()
      const response = await fetch(url, { credentials: 'include' })
      const json = await response.json()
      if (response.ok) {
        return { ok: true as const, data: json as PaginatedResponse }
      }
      const error = new ResponseError(response.status, json.error)
      return { ok: false as const, error }
    } catch (e) {
      console.log(e)
      const error = new ResponseError(500, 'the server encountered an error')
      return { ok: false as const, error }
    }
  }
}

export async function updateUser(
  fullName?: string,
  email?: string,
  password?: string
) {
  const body: Record<string, string> = {}

  if (fullName) {
    body.fullName = fullName
  }

  if (email) {
    body.email = email
  }

  if (password) {
    body.password = password
  }

  try {
    const res = await fetch(baseUrl, {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify(body)
    })

    if (res.ok) {
      const { user } = (await res.json()) as { user: User }
      return { user, ok: true as const }
    } else {
      const { error } = await res.json()
      return { error, status: res.status, ok: false as const }
    }
  } catch (e) {
    console.log(e)
    return {
      error: 'Something went wrong. Try again later.',
      ok: false as const
    }
  }
}
