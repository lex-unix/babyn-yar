import { ResponseError } from 'shared'
import type {
  Book,
  Event,
  HolocaustDocument,
  VictimTestimony,
  Metadata,
  MediaArticle,
  GalleryImage
} from 'shared-types'

type DynamicTypedKey<T, K extends string> = Record<K, T>

type PaginatedResponse<T, K extends string> = {
  metadata: Metadata
} & Record<K, T[]>

const apiURL = import.meta.env.API_URL

async function fetcher<T>(
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

export function getEvents(page: string = '1') {
  const url = new URL(apiURL + '/events')
  url.searchParams.set('page', page)
  url.searchParams.set('lang', 'ua')
  url.searchParams.set('sort', '-occured_on')
  return fetcher<PaginatedResponse<Event, 'events'>>(url)
}

export function getBooks(page = '1') {
  const url = new URL(apiURL + '/books')
  url.searchParams.set('page', `${page}`)
  url.searchParams.set('lang', 'ua')
  url.searchParams.set('sort', '-occured_on')
  return fetcher<PaginatedResponse<Book, 'books'>>(url)
}

export function getArticles(page = '1') {
  const url = new URL(apiURL + '/media-articles')
  url.searchParams.set('page', page)
  url.searchParams.set('lang', 'ua')
  url.searchParams.set('sort', '-occurred_on')
  return fetcher<PaginatedResponse<MediaArticle, 'articles'>>(url)
}

export function getTestimonies(page = '1') {
  const url = new URL(apiURL + '/victim-testimonies')
  url.searchParams.set('page', `${page}`)
  url.searchParams.set('lang', 'ua')
  url.searchParams.set('sort', '-occured_on')
  return fetcher<PaginatedResponse<VictimTestimony, 'testimonies'>>(url)
}

export function getHolocaustDocuments(page = '1') {
  const url = new URL(apiURL + '/holocaust-documents')
  url.searchParams.set('page', `${page}`)
  url.searchParams.set('lang', 'ua')
  url.searchParams.set('sort', '-occured_on')
  return fetcher<PaginatedResponse<HolocaustDocument, 'documents'>>(url)
}

export function getEvent(id: string) {
  return fetcher<DynamicTypedKey<Event, 'event'>>(`${apiURL}/events/${id}`)
}

export function getGalleryImages() {
  return fetcher<DynamicTypedKey<GalleryImage[], 'images'>>(`${apiURL}/gallery`)
}

export function getBook(id: string) {
  return fetcher<DynamicTypedKey<Book, 'book'>>(`${apiURL}/books/${id}`)
}

export function getArticle(id: string) {
  return fetcher<DynamicTypedKey<MediaArticle, 'article'>>(
    `${apiURL}/media-articles/${id}`
  )
}

export function getTestimony(id: string) {
  return fetcher<DynamicTypedKey<VictimTestimony, 'testimony'>>(
    `${apiURL}/victim-testimonies/${id}`
  )
}

export function getHolocaustDocument(id: string) {
  return fetcher<DynamicTypedKey<Book, 'document'>>(
    `${apiURL}/holocaust-documents/${id}`
  )
}
