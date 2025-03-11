import { ResponseError } from 'shared'

const DEFAULT_REQUEST_OPTS: RequestInit = {
  credentials: 'include'
}

export async function fetcher(url: URL | string, opts: RequestInit = {}) {
  const response = await fetch(url, { ...DEFAULT_REQUEST_OPTS, ...opts })
  if (!response.ok) {
    let responseError: string | Record<string, string>
    try {
      const { error } = await response.json()
      responseError = error
    } catch (error) {
      responseError = response.statusText
    }
    throw new ResponseError(response.status, responseError)
  }
  return response.json()
}
