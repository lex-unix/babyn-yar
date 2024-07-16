import { fetcher } from 'shared'
import type {
  Book,
  Event,
  HolocaustDocument,
  VictimTestimony,
  MediaArticle,
  GalleryImage,
  Partner,
  DynamicTypedKey,
  PaginatedResponse,
  LegalDocument,
  DevConcept
} from 'shared-types'

const apiURL = import.meta.env.API_URL

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
  url.searchParams.set('sort', '-occured_on')
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

export function getPartners(page = '1') {
  const url = new URL(apiURL + '/partners')
  url.searchParams.set('page', `${page}`)
  url.searchParams.set('lang', 'ua')
  url.searchParams.set('sort', '-occured_on')
  return fetcher<PaginatedResponse<Partner, 'partners'>>(url)
}

export function getLegalDocuments(page = '1') {
  const url = new URL(apiURL + '/legal-documents')
  url.searchParams.set('page', `${page}`)
  url.searchParams.set('lang', 'ua')
  url.searchParams.set('sort', '-occured_on')
  return fetcher<PaginatedResponse<LegalDocument, 'documents'>>(url)
}

export function getDevConcepts(page = '1') {
  const url = new URL(apiURL + '/development-concepts')
  url.searchParams.set('page', `${page}`)
  url.searchParams.set('lang', 'ua')
  url.searchParams.set('sort', '-occured_on')
  return fetcher<PaginatedResponse<DevConcept, 'concepts'>>(url)
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

export function getPartner(id: string) {
  return fetcher<DynamicTypedKey<Partner, 'partner'>>(
    `${apiURL}/partners/${id}`
  )
}

export function getLegalDocument(id: string) {
  return fetcher<DynamicTypedKey<LegalDocument, 'document'>>(
    `${apiURL}/legal-documents/${id}`
  )
}

export function getDevConcept(id: string) {
  return fetcher<DynamicTypedKey<DevConcept, 'concept'>>(
    `${apiURL}/development-concepts/${id}`
  )
}
