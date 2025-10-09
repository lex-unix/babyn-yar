import { PUBLIC_API_URL } from '$env/static/public'
import { fetcher } from '$lib/fetcher'
import { parse, type GenericSchema } from 'valibot'
import {
  ContentForm,
  ContentFormSimple,
  type Content,
  type ContentFilters,
  type Translation
} from './schema'
import type { Metadata } from '$lib/pagination/schema'

export async function fetchEvent(
  id: string
): Promise<{ event: Content; translation: Translation }> {
  const response = await fetchContent('events', id)
  response.event.content = JSON.parse(
    response.event.content as unknown as string
  )
  return response
}

export async function fetchEvents(
  filters: ContentFilters = {}
): Promise<{ events: Content[]; metadata: Metadata }> {
  return fetchContentRecords('events', filters)
}

export async function patchEvent(
  id: string,
  content: ContentForm
): Promise<{ event: Content }> {
  return patchContent('events', id, content)
}

export async function postEvent(
  content: ContentForm
): Promise<{ event: Content }> {
  return postContent('events', content)
}

export async function deleteEvents(ids: number[]) {
  return deleteRecords('events', ids)
}

export async function fetchBooks(filters: ContentFilters = {}): Promise<{
  books: Content[]
  metadata: Metadata
}> {
  return fetchContentRecords('books', filters)
}

export async function fetchBook(
  id: string
): Promise<{ book: Content; translation: Translation }> {
  const response = await fetchContent('books', id)
  response.book.content = JSON.parse(response.book.content as unknown as string)
  return response
}

export async function patchBook(
  id: string,
  content: ContentForm
): Promise<{ book: Content }> {
  return patchContent('books', id, content)
}

export async function postBook(
  content: ContentForm
): Promise<{ book: Content }> {
  return postContent('books', content)
}

export async function deleteBooks(ids: number[]) {
  return deleteRecords('books', ids)
}

export async function fetchMediaArticles(
  filters: ContentFilters = {}
): Promise<{
  articles: Content[]
  metadata: Metadata
}> {
  return fetchContentRecords('media-articles', filters)
}

export async function fetchMediaArticle(
  id: string
): Promise<{ article: Content; translation: Translation }> {
  const response = await fetchContent('media-articles', id)
  response.article.content = JSON.parse(
    response.article.content as unknown as string
  )
  return response
}

export async function patchMediaArticle(
  id: string,
  content: ContentFormSimple
): Promise<{ article: Content }> {
  return patchContent('media-articles', id, content, ContentFormSimple)
}

export async function deleteMediaArticles(ids: number[]) {
  return deleteRecords('media-articles', ids)
}

export async function fetchHolocaustDocuments(
  filters: ContentFilters = {}
): Promise<{
  documents: Content[]
  metadata: Metadata
}> {
  return fetchContentRecords('holocaust-documents', filters)
}

export async function fetchHolocaustDocument(
  id: string
): Promise<{ document: Content; translation: Translation }> {
  const response = await fetchContent('holocaust-documents', id)
  response.document.content = JSON.parse(
    response.document.content as unknown as string
  )
  return response
}

export async function patchHolocaustDocument(
  id: string,
  content: ContentFormSimple
): Promise<{ document: Content }> {
  return patchContent('holocaust-documents', id, content, ContentFormSimple)
}

export async function postHolocaustDocument(
  content: ContentFormSimple
): Promise<{ document: Content }> {
  return postContent('holocaust-documents', content, ContentFormSimple)
}

export async function deleteHolocaustDocuments(ids: number[]) {
  return deleteRecords('holocaust-documents', ids)
}

export async function fetchPartners(filters: ContentFilters = {}): Promise<{
  partners: Content[]
  metadata: Metadata
}> {
  return fetchContentRecords('partners', filters)
}

export async function fetchPartner(
  id: string
): Promise<{ partner: Content; translation: Translation }> {
  const response = await fetchContent('partners', id)
  response.partner.content = JSON.parse(
    response.partner.content as unknown as string
  )
  return response
}

export async function patchPartner(
  id: string,
  content: ContentFormSimple
): Promise<{ partner: Content }> {
  return patchContent('partners', id, content, ContentFormSimple)
}

export async function postPartner(
  content: ContentFormSimple
): Promise<{ partner: Content }> {
  return postContent('partners', content, ContentFormSimple)
}

export async function deletePartners(ids: number[]) {
  return deleteRecords('partners', ids)
}

export async function fetchTestimonies(filters: ContentFilters = {}): Promise<{
  testimonies: Content[]
  metadata: Metadata
}> {
  return fetchContentRecords('victim-testimonies', filters)
}

export async function fetchTestimony(
  id: string
): Promise<{ testimony: Content; translation: Translation }> {
  const response = await fetchContent('victim-testimonies', id)
  response.testimony.content = JSON.parse(
    response.testimony.content as unknown as string
  )
  return response
}

export async function patchTestimony(
  id: string,
  content: ContentFormSimple
): Promise<{ testimony: Content }> {
  return patchContent('victim-testimonies', id, content, ContentFormSimple)
}

export async function deleteTestimonies(ids: number[]) {
  return deleteRecords('victim-testimonies', ids)
}

export async function postTestimony(
  content: ContentFormSimple
): Promise<{ testimony: Content }> {
  return postContent('victim-testimonies', content, ContentFormSimple)
}

export async function postMediaArticle(
  content: ContentFormSimple
): Promise<{ article: Content }> {
  return postContent('media-articles', content, ContentFormSimple)
}

export async function fetchLegalDocuments(
  filters: ContentFilters = {}
): Promise<{
  documents: Content[]
  metadata: Metadata
}> {
  return fetchContentRecords('legal-documents', filters)
}

export async function fetchLegalDocument(
  id: string
): Promise<{ document: Content; translation: Translation }> {
  const response = await fetchContent('legal-documents', id)
  response.document.content = JSON.parse(
    response.document.content as unknown as string
  )
  return response
}

export async function patchLegalDocument(
  id: string,
  content: ContentForm
): Promise<{ document: Content }> {
  return patchContent('legal-documents', id, content)
}

export async function postLegalDocument(
  content: ContentForm
): Promise<{ document: Content }> {
  return postContent('legal-documents', content)
}

export async function deleteLegalDocuments(ids: number[]) {
  return deleteRecords('legal-documents', ids)
}

export async function fetchDevelopmentConcepts(
  filters: ContentFilters = {}
): Promise<{
  concepts: Content[]
  metadata: Metadata
}> {
  return fetchContentRecords('development-concepts', filters)
}

export async function fetchDevelopmentConcept(
  id: string
): Promise<{ concept: Content; translation: Translation }> {
  const response = await fetchContent('development-concepts', id)
  response.concept.content = JSON.parse(
    response.concept.content as unknown as string
  )
  return response
}

export async function patchDevelopmentConcept(
  id: string,
  content: ContentFormSimple
): Promise<{ concept: Content }> {
  return patchContent('development-concepts', id, content, ContentFormSimple)
}

export async function postDevelopmentConcept(
  content: ContentFormSimple
): Promise<{ concept: Content }> {
  return postContent('development-concepts', content, ContentFormSimple)
}

export async function deleteDevelopmentConcepts(ids: number[]) {
  return deleteRecords('development-concepts', ids)
}

export async function postContent<T>(
  slug: string,
  content: T,
  schema: GenericSchema = ContentForm
) {
  const url = new URL(`/v1/${slug}`, PUBLIC_API_URL)
  const body = parse(schema, content)
  return fetcher(url, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(body)
  })
}

export async function patchContent<T>(
  slug: string,
  id: string,
  content: T,
  schema: GenericSchema = ContentForm
) {
  const url = new URL(`/v1/${slug}/${id}`, PUBLIC_API_URL)
  const body = parse(schema, content)
  return fetcher(url, {
    method: 'PATCH',
    credentials: 'include',
    body: JSON.stringify(body)
  })
}

export async function fetchContent(slug: string, id: string) {
  const url = new URL(`/v1/${slug}/${id}`, PUBLIC_API_URL)
  return fetcher(url)
}

export async function fetchContentRecords(
  slug: string,
  filters: ContentFilters
) {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null) {
      const s = String(value)
      if (s !== '') {
        params.set(key, s)
      }
    }
  }

  const url = new URL(`/v1/${slug}`, PUBLIC_API_URL)
  url.search = params.toString()

  return fetcher(url.toString())
}

export async function deleteRecords(slug: string, ids: number[]) {
  const url = new URL(`/v1/${slug}`, PUBLIC_API_URL)
  url.searchParams.set('ids', ids.join(','))
  return fetcher(url, {
    method: 'DELETE',
    credentials: 'include'
  })
}
