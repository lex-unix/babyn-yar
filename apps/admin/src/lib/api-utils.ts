import { ResponseError } from './response-error'
import { PUBLIC_API_URL } from '$env/static/public'
import type { Book, Metadata, MediaArticle } from './types'

const BOOKS_ENDPOINT = `${PUBLIC_API_URL}/books`
const MEDIA_ARTICLES_ENDPOINT = `${PUBLIC_API_URL}/media-articles`

export type Filters = {
  page?: number
  pageSize?: number
  sort?: string
  [key: string]: string | number | undefined
}

type PaginatedResponse<T, K extends string> = {
  metadata: Metadata
} & Record<K, T[]>

function camelToSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, match => `_${match.toLowerCase()}`)
}

function sendGetWithFilters<T>(endpoint: string) {
  return () => {
    const url = new URL(endpoint)
    const searchParams = new URLSearchParams()

    searchParams.set('page_size', '10')

    return async (
      filters: Filters = {}
    ): Promise<{ ok: true; data: T } | { ok: false; error: ResponseError }> => {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(camelToSnakeCase(key), `${value}`)
        }
      })
      url.search = searchParams.toString()
      try {
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include'
        })
        const json = await response.json()
        if (!response.ok) {
          const error = new ResponseError(response.status, json.error)
          return { ok: false, error }
        }
        return { ok: true, data: json }
      } catch (e) {
        console.error(e)
        const error = new ResponseError(500, 'the server encountered an error')
        return { ok: false, error }
      }
    }
  }
}

type DynamicKey<T, K extends string> = Record<K, T>
async function sendGetRequest<T>(
  endpoint: string
): Promise<{ ok: true; data: T } | { ok: false; error: ResponseError }> {
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      credentials: 'include'
    })
    const json = await response.json()
    if (!response.ok) {
      const error = new ResponseError(response.status, json.detail)
      return { ok: false, error }
    }
    return { ok: true, data: json }
  } catch (e) {
    console.error(e)
    const error = new ResponseError(500, 'The server encountered an error')
    return { ok: false, error }
  }
}

async function sendPostRequest<T>(
  endpoint: string,
  body: string
): Promise<{ ok: true; data: T } | { ok: false; error: ResponseError }> {
  try {
    const response = await fetch(endpoint, {
      credentials: 'include',
      method: 'POST',
      body
    })
    const json = await response.json()
    if (!response.ok) {
      const error = new ResponseError(response.status, json.detail)
      return { ok: false, error }
    }
    return { ok: true, data: json }
  } catch (e) {
    console.error(e)
    const error = new ResponseError(500, 'The server encountered an error')
    return { ok: false, error }
  }
}

async function sendPatchRequest<T>(
  endpoint: string,
  body: string
): Promise<{ ok: true; data: T } | { ok: false; error: ResponseError }> {
  try {
    const response = await fetch(endpoint, {
      credentials: 'include',
      method: 'PATCH',
      body
    })
    const json = await response.json()
    if (!response.ok) {
      const error = new ResponseError(response.status, json.detail)
      return { ok: false, error }
    }
    return { ok: true, data: json }
  } catch (e) {
    console.error(e)
    const error = new ResponseError(500, 'The server encountered an error')
    return { ok: false, error }
  }
}

async function sendDeleteRequest(endpoint: string) {
  try {
    const response = await fetch(endpoint, {
      method: 'DELETE',
      credentials: 'include'
    })
    return { ok: response.ok }
  } catch (e) {
    return { ok: false }
  }
}

export const fetchBooksWrapper =
  sendGetWithFilters<PaginatedResponse<Book, 'books'>>(BOOKS_ENDPOINT)
export function fetchBook(id: string) {
  return sendGetRequest<DynamicKey<Book, 'book'>>(`${BOOKS_ENDPOINT}/${id}`)
}
export function createBook(body: string) {
  return sendPostRequest<Book>(BOOKS_ENDPOINT, body)
}
export function updateBook(id: string, body: string) {
  return sendPatchRequest<Book>(`${BOOKS_ENDPOINT}/${id}`, body)
}
export function deleteBooks(ids: number[]) {
  const url = new URL(BOOKS_ENDPOINT)
  url.searchParams.set('ids', ids.join(','))
  return sendDeleteRequest(url.toString())
}

export const fetchArticlesWrapper = sendGetWithFilters<
  PaginatedResponse<MediaArticle, 'articles'>
>(MEDIA_ARTICLES_ENDPOINT)
export function fetchArticle(id: string) {
  return sendGetRequest<DynamicKey<MediaArticle, 'article'>>(
    `${MEDIA_ARTICLES_ENDPOINT}/${id}`
  )
}
export function createArticle(body: string) {
  return sendPostRequest<MediaArticle>(MEDIA_ARTICLES_ENDPOINT, body)
}
export function updateArticle(id: string, body: string) {
  return sendPatchRequest<MediaArticle>(
    `${MEDIA_ARTICLES_ENDPOINT}/${id}`,
    body
  )
}
export function deleteArticles(ids: number[]) {
  const url = new URL(MEDIA_ARTICLES_ENDPOINT)
  url.searchParams.set('ids', ids.join(','))
  return sendDeleteRequest(url.toString())
}
