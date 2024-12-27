import { fetcher } from 'shared'
import { PUBLIC_API_URL } from '$env/static/public'
import type {
  Book,
  MediaArticle,
  GalleryImage,
  Event,
  HolocaustDocument,
  VictimTestimony,
  Partner,
  LegalDocument,
  DevConcept,
  User
} from './types'
import type { PaginatedResponse, DynamicTypedKey } from 'shared-types'

type Translations = {
  id: number
  ukrainianId: number
  ukrainianTitle: string
  englishId: number
  englishTitle: string
}

const BOOKS_ENDPOINT = `${PUBLIC_API_URL}/books`
const MEDIA_ARTICLES_ENDPOINT = `${PUBLIC_API_URL}/media-articles`
const GALLERY_IMGS_ENDPOINT = `${PUBLIC_API_URL}/gallery`
const EVENTS_ENDPOINT = `${PUBLIC_API_URL}/events`
const HOLOCAUST_DOCS_ENDPOINT = `${PUBLIC_API_URL}/holocaust-documents`
const TESTIMONIES_ENDPOINT = `${PUBLIC_API_URL}/victim-testimonies`
const USERS_ENDPOINT = `${PUBLIC_API_URL}/users`
const ASSETS_ENDPOINT = `${PUBLIC_API_URL}/assets`
const PARTNERS_ENDPOINT = `${PUBLIC_API_URL}/partners`
const LEGAL_DOCUMENTS_ENDPOINT = `${PUBLIC_API_URL}/legal-documents`
const DEV_CONCEPT_ENDPOINT = `${PUBLIC_API_URL}/development-concepts`

export function getBooks(params: Record<string, string> = {}) {
  const url = new URL(BOOKS_ENDPOINT)
  for (const param in params) {
    url.searchParams.set(param, `${params[param]}`)
  }
  return fetcher<PaginatedResponse<Book, 'books'>>(url)
}

export function fetchBook(id: string) {
  return fetcher<
    DynamicTypedKey<Book, 'book'> & { translation?: Translations }
  >(`${BOOKS_ENDPOINT}/${id}`)
}

export function createBook(body: string) {
  const opts: RequestInit = { method: 'POST', credentials: 'include', body }
  return fetcher<Book>(BOOKS_ENDPOINT, opts)
}

export function updateBook(id: string, body: string) {
  const opts: RequestInit = { method: 'PATCH', credentials: 'include', body }
  return fetcher<Book>(`${BOOKS_ENDPOINT}/${id}`, opts)
}

export function deleteBooks(ids: number[]) {
  const opts: RequestInit = { method: 'DELETE', credentials: 'include' }
  const url = new URL(BOOKS_ENDPOINT)
  url.searchParams.set('ids', ids.join(','))
  return fetcher(url, opts)
}

export function getArticles(params: Record<string, string> = {}) {
  const url = new URL(MEDIA_ARTICLES_ENDPOINT)
  for (const param in params) {
    url.searchParams.set(param, `${params[param]}`)
  }
  return fetcher<PaginatedResponse<MediaArticle, 'articles'>>(url)
}

export function fetchArticle(id: string) {
  const url = `${MEDIA_ARTICLES_ENDPOINT}/${id}`
  return fetcher<
    DynamicTypedKey<MediaArticle, 'article'> & { translation?: Translations }
  >(url)
}

export function createArticle(body: string) {
  const opts: RequestInit = { method: 'POST', credentials: 'include', body }
  return fetcher<MediaArticle>(MEDIA_ARTICLES_ENDPOINT, opts)
}

export function updateArticle(id: string, body: string) {
  const opts: RequestInit = { method: 'PATCH', credentials: 'include', body }
  return fetcher<MediaArticle>(`${MEDIA_ARTICLES_ENDPOINT}/${id}`, opts)
}

export function deleteArticles(ids: number[]) {
  const opts: RequestInit = { method: 'DELETE', credentials: 'include' }
  const url = new URL(MEDIA_ARTICLES_ENDPOINT)
  url.searchParams.set('ids', ids.join(','))
  return fetcher(url, opts)
}

export function fetchGalleryImages() {
  return fetcher<DynamicTypedKey<GalleryImage[], 'images'>>(
    GALLERY_IMGS_ENDPOINT
  )
}

export function createGalleryImage(body: string) {
  const opts: RequestInit = { method: 'POST', credentials: 'include', body }
  return fetcher<GalleryImage>(GALLERY_IMGS_ENDPOINT, opts)
}

export function deleteGalleryImage(id: number) {
  const opts: RequestInit = { method: 'DELETE', credentials: 'include' }
  return fetcher(`${GALLERY_IMGS_ENDPOINT}/${id}`, opts)
}

export function getEvents(params: Record<string, string> = {}) {
  const url = new URL(EVENTS_ENDPOINT)
  for (const param in params) {
    url.searchParams.set(param, params[param])
  }
  return fetcher<PaginatedResponse<Event, 'events'>>(url)
}

export function getEvent(id: string) {
  return fetcher<
    DynamicTypedKey<Event, 'event'> & { translation?: Translations }
  >(`${EVENTS_ENDPOINT}/${id}`)
}

export function createEvent(body: string) {
  const opts: RequestInit = { method: 'POST', credentials: 'include', body }
  return fetcher<Event>(EVENTS_ENDPOINT, opts)
}

export function updateEvent(id: string, body: string) {
  const opts: RequestInit = { method: 'PATCH', credentials: 'include', body }
  return fetcher<Event>(`${EVENTS_ENDPOINT}/${id}`, opts)
}

export function deleteEvents(ids: number[]) {
  const opts: RequestInit = { method: 'DELETE', credentials: 'include' }
  const url = new URL(EVENTS_ENDPOINT)
  url.searchParams.set('ids', ids.join(','))
  return fetcher(url, opts)
}

export function getHolocaustDocs(params: Record<string, string> = {}) {
  const url = new URL(HOLOCAUST_DOCS_ENDPOINT)
  for (const param in params) {
    url.searchParams.set(param, params[param])
  }
  return fetcher<PaginatedResponse<HolocaustDocument, 'documents'>>(url)
}

export function getHolocaustDoc(id: string) {
  return fetcher<
    DynamicTypedKey<HolocaustDocument, 'document'> & {
      translation?: Translations
    }
  >(`${HOLOCAUST_DOCS_ENDPOINT}/${id}`)
}

export function createHolocaustDoc(body: string) {
  const opts: RequestInit = { method: 'POST', credentials: 'include', body }
  return fetcher<HolocaustDocument>(HOLOCAUST_DOCS_ENDPOINT, opts)
}

export function updateHolocaustDoc(id: string, body: string) {
  const opts: RequestInit = { method: 'PATCH', credentials: 'include', body }
  return fetcher<HolocaustDocument>(`${HOLOCAUST_DOCS_ENDPOINT}/${id}`, opts)
}

export function deleteHolocaustDocs(ids: number[]) {
  const opts: RequestInit = { method: 'DELETE', credentials: 'include' }
  const url = new URL(HOLOCAUST_DOCS_ENDPOINT)
  url.searchParams.set('ids', ids.join(','))
  return fetcher(url, opts)
}

export function getTestimonies(params: Record<string, string>) {
  const url = new URL(TESTIMONIES_ENDPOINT)
  for (const param in params) {
    url.searchParams.set(param, params[param])
  }
  return fetcher<PaginatedResponse<VictimTestimony, 'testimonies'>>(url)
}

export function getTestimony(id: string) {
  return fetcher<DynamicTypedKey<VictimTestimony, 'testimony'>>(
    `${TESTIMONIES_ENDPOINT}/${id}`
  )
}

export function createTestimony(body: string) {
  const opts: RequestInit = { method: 'POST', credentials: 'include', body }
  return fetcher<VictimTestimony>(TESTIMONIES_ENDPOINT, opts)
}

export function updateTestimony(id: string, body: string) {
  const opts: RequestInit = { method: 'PATCH', credentials: 'include', body }
  return fetcher<VictimTestimony>(`${TESTIMONIES_ENDPOINT}/${id}`, opts)
}

export function deleteTestimonies(ids: number[]) {
  const opts: RequestInit = { method: 'DELETE', credentials: 'include' }
  const url = new URL(TESTIMONIES_ENDPOINT)
  url.searchParams.set('ids', ids.join(','))
  return fetcher(url, opts)
}

export function login(body: string) {
  const opts: RequestInit = { method: 'POST', credentials: 'include', body }
  return fetcher<DynamicTypedKey<User, 'user'>>(`${USERS_ENDPOINT}/login`, opts)
}

export function register(body: string) {
  const opts: RequestInit = { method: 'POST', credentials: 'include', body }
  return fetcher<DynamicTypedKey<User, 'user'>>(
    `${USERS_ENDPOINT}/register`,
    opts
  )
}

export function deleteUsers(ids: number[]) {
  const opts: RequestInit = { method: 'DELETE', credentials: 'include' }
  const url = new URL(USERS_ENDPOINT)
  url.searchParams.set('ids', ids.join(','))
  return fetcher(url, opts)
}

export function createAssets(body: FormData) {
  const opts: RequestInit = { method: 'POST', credentials: 'include', body }
  return fetcher(ASSETS_ENDPOINT, opts)
}

export function deleteAssets(ids: number[]) {
  const opts: RequestInit = { method: 'DELETE', credentials: 'include' }
  const url = new URL(ASSETS_ENDPOINT)
  url.searchParams.set('ids', ids.join(','))
  return fetcher(url, opts)
}

export function getPartners(params: Record<string, string> = {}) {
  const url = new URL(PARTNERS_ENDPOINT)
  for (const param in params) {
    url.searchParams.set(param, params[param])
  }
  return fetcher<PaginatedResponse<Partner, 'partners'>>(url)
}

export function getPartner(id: string) {
  return fetcher<
    DynamicTypedKey<Partner, 'partner'> & { translation?: Translations }
  >(`${PARTNERS_ENDPOINT}/${id}`)
}

export function createPartner(body: string) {
  const opts: RequestInit = { method: 'POST', credentials: 'include', body }
  return fetcher<Partner>(PARTNERS_ENDPOINT, opts)
}

export function updatePartner(id: string, body: string) {
  const opts: RequestInit = { method: 'PATCH', credentials: 'include', body }
  return fetcher<Partner>(`${PARTNERS_ENDPOINT}/${id}`, opts)
}

export function deletePartners(ids: number[]) {
  const opts: RequestInit = { method: 'DELETE', credentials: 'include' }
  const url = new URL(PARTNERS_ENDPOINT)
  url.searchParams.set('ids', ids.join(','))
  return fetcher(url, opts)
}

export function getLegalDocuments(params: Record<string, string>) {
  const url = new URL(LEGAL_DOCUMENTS_ENDPOINT)
  for (const param in params) {
    url.searchParams.set(param, params[param])
  }
  return fetcher<PaginatedResponse<LegalDocument, 'documents'>>(url)
}

export function getLegalDocument(id: string) {
  return fetcher<DynamicTypedKey<LegalDocument, 'document'>>(
    `${LEGAL_DOCUMENTS_ENDPOINT}/${id}`
  )
}

export function createLegalDocument(body: string) {
  const opts: RequestInit = { method: 'POST', credentials: 'include', body }
  return fetcher<LegalDocument>(LEGAL_DOCUMENTS_ENDPOINT, opts)
}

export function updateLegalDocument(id: string, body: string) {
  const opts: RequestInit = { method: 'PATCH', credentials: 'include', body }
  return fetcher<LegalDocument>(`${LEGAL_DOCUMENTS_ENDPOINT}/${id}`, opts)
}

export function deleteLegalDocuments(ids: number[]) {
  const opts: RequestInit = { method: 'DELETE', credentials: 'include' }
  const url = new URL(LEGAL_DOCUMENTS_ENDPOINT)
  url.searchParams.set('ids', ids.join(','))
  return fetcher(url, opts)
}

export function getDevConcepts(params: Record<string, string> = {}) {
  const url = new URL(DEV_CONCEPT_ENDPOINT)
  for (const param in params) {
    url.searchParams.set(param, params[param])
  }
  return fetcher<PaginatedResponse<DevConcept, 'concepts'>>(url)
}

export function getDevConcept(id: string) {
  return fetcher<DynamicTypedKey<DevConcept, 'concept'>>(
    `${DEV_CONCEPT_ENDPOINT}/${id}`
  )
}

export function createDevConcept(body: string) {
  const opts: RequestInit = { method: 'POST', credentials: 'include', body }
  return fetcher<DevConcept>(DEV_CONCEPT_ENDPOINT, opts)
}

export function updateDevConcept(id: string, body: string) {
  const opts: RequestInit = { method: 'PATCH', credentials: 'include', body }
  return fetcher<DevConcept>(`${DEV_CONCEPT_ENDPOINT}/${id}`, opts)
}

export function deleteDevConcepts(ids: number[]) {
  const opts: RequestInit = { method: 'DELETE', credentials: 'include' }
  const url = new URL(DEV_CONCEPT_ENDPOINT)
  url.searchParams.set('ids', ids.join(','))
  return fetcher(url, opts)
}
