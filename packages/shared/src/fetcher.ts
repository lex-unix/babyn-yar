import { ResponseError } from './response-error'

export async function fetcher<T>(
  endpoint: string | URL,
  init?: RequestInit
): Promise<{ ok: true; data: T } | { ok: false; error: ResponseError }> {
  try {
    const response = await fetch(endpoint, init)
    const json = await response.json()
    if (!response.ok) {
      return {
        ok: false,
        error: new ResponseError(response.status, json.error)
      }
    }
    return { ok: true, data: json }
  } catch (e) {
    console.error(e)
    const error = new ResponseError(500, 'the server encountered an error')
    return { ok: false, error }
  }
}
