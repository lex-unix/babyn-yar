import { PUBLIC_API_URL } from '$env/static/public'
import type { Book, Metadata } from './types'
import { ResponseError } from './response-error'

const baseUrl = PUBLIC_API_URL + '/books'

export async function createBook(body: string) {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      body,
      credentials: 'include'
    })
    if (!response.ok) {
      const json = await response.json()
      const error = new ResponseError(response.status, json.error)
      return { ok: false as const, error }
    }
    return { ok: true as const }
  } catch (e) {
    console.log(e)
    const error = new ResponseError(500, 'the server encountered an error')
    return { ok: false as const, error }
  }
}

export async function fetchBooks(page: number = 1) {
  const url = new URL(baseUrl)
  url.searchParams.set('page', `${page}`)
  try {
    const response = await fetch(url)
    if (response.ok) {
      const json: { books: Book[]; metadata: Metadata } = await response.json()
      return { ok: true as const, data: json }
    }
    return { ok: false as const }
  } catch (e) {
    console.log(e)
    return { ok: false as const }
  }
}

export async function fetchBook(id: string) {
  try {
    const response = await fetch(`${baseUrl}/${id}`)
    if (response.ok) {
      const json = await response.json()
      const { book } = json as { book: Book }
      book.content = JSON.parse(book.content as unknown as string)
      return { ok: true as const, book }
    }
    return { ok: false as const }
  } catch (e) {
    console.log(e)
    return { ok: false as const }
  }
}

export async function updateBook(id: string, body: string) {
  try {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      body,
      credentials: 'include'
    })
    if (!response.ok) {
      const json = await response.json()
      const error = new ResponseError(response.status, json.error)
      return { ok: false as const, error }
    }
    return { ok: true as const }
  } catch (e) {
    console.log(e)
    const error = new ResponseError(500, 'the server encountered an error')
    return { ok: false as const, error }
  }
}

export async function deleteBooks(ids: number[]) {
  const url = new URL(baseUrl)
  url.searchParams.set('ids', ids.join(','))
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      credentials: 'include'
    })
    return { ok: response.ok }
  } catch (e) {
    return { ok: false as const }
  }
}
