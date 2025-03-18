import { PUBLIC_API_URL } from '$env/static/public'
import { fetcher } from '$lib/fetcher'

export async function register(newUser: {
  fullName: string
  email: string
  password: string
  permission: string
}) {
  return fetcher(PUBLIC_API_URL + '/users/register', {
    body: JSON.stringify(newUser),
    method: 'POST'
  })
}

export async function login(credentials: { email: string; password: string }) {
  return fetcher(PUBLIC_API_URL + '/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
}

export async function fetchLoggedUser() {
  return fetcher(PUBLIC_API_URL + '/users/me')
}
