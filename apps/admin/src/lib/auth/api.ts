import { PUBLIC_API_URL } from '$env/static/public'
import { fetcher } from '$lib/fetcher'
import { UserResponse } from '$lib/users/schema'
import { parse } from 'valibot'
import type { Login, RegisterUser } from './schema'

export async function register(newUser: RegisterUser) {
  const response = await fetcher(PUBLIC_API_URL + '/users/register', {
    body: JSON.stringify(newUser),
    method: 'POST'
  })
  return parse(UserResponse, response)
}

export async function login(credentials: Login) {
  const response = await fetcher(PUBLIC_API_URL + '/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
  return parse(UserResponse, response)
}

export async function fetchLoggedUser() {
  const response = await fetcher(PUBLIC_API_URL + '/users/me')
  return parse(UserResponse, response)
}
