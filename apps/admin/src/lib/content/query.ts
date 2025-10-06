import type { Getter } from '$lib/runes'
import {
  createMutation,
  createQuery,
  keepPreviousData,
  useQueryClient
} from '@tanstack/svelte-query'
import {
  fetchBook,
  fetchBooks,
  fetchEvent,
  fetchEvents,
  fetchHolocaustDocument,
  fetchHolocaustDocuments,
  fetchLegalDocument,
  fetchLegalDocuments,
  fetchDevelopmentConcept,
  fetchDevelopmentConcepts,
  fetchMediaArticle,
  fetchMediaArticles,
  fetchPartner,
  fetchPartners,
  fetchTestimony,
  fetchTestimonies,
  patchBook,
  postBook,
  patchEvent,
  patchHolocaustDocument,
  postEvent,
  patchLegalDocument,
  patchDevelopmentConcept,
  patchMediaArticle,
  patchPartner,
  patchTestimony,
  postTestimony,
  postMediaArticle,
  postHolocaustDocument,
  postLegalDocument,
  postDevelopmentConcept,
  postPartner,
  deleteRecords,
  deleteEvents,
  deleteBooks
} from './api'
import type { ContentFilters, ContentForm, ContentFormSimple } from './schema'
import { useContentFilters } from '$lib/use-content-filters'

type QueryOptions = {
  staleTime?: number
  enabled?: boolean
}

const eventKeys = {
  all: ['events'] as const,
  list: (filters: ContentFilters) => [...eventKeys.all, filters],
  single: (id: string) => [...eventKeys.all, id]
}

const booksKeys = {
  all: ['books'] as const,
  list: (filters: ContentFilters) => [...booksKeys.all, filters],
  single: (id: string) => [...booksKeys.all, id]
}

const mediaArticlesKeys = {
  all: ['media-articles'] as const,
  list: (filters: ContentFilters) => [...mediaArticlesKeys.all, filters],
  single: (id: string) => [...mediaArticlesKeys.all, id]
}

const holocaustDocumentsKeys = {
  all: ['holocaust-documents'] as const,
  list: (filters: ContentFilters) => [...holocaustDocumentsKeys.all, filters],
  single: (id: string) => [...holocaustDocumentsKeys.all, id]
}

const partnersKeys = {
  all: ['partners'] as const,
  list: (filters: ContentFilters) => [...partnersKeys.all, filters],
  single: (id: string) => [...partnersKeys.all, id]
}

const testimoniesKeys = {
  all: ['victim-testimonies'] as const,
  list: (filters: ContentFilters) => [...testimoniesKeys.all, filters],
  single: (id: string) => [...testimoniesKeys.all, id]
}

const legalDocumentsKeys = {
  all: ['legal-documents'] as const,
  list: (filters: ContentFilters) => [...legalDocumentsKeys.all, filters],
  single: (id: string) => [...legalDocumentsKeys.all, id]
}

const developmentConceptsKeys = {
  all: ['development-concepts'] as const,
  list: (filters: ContentFilters) => [...developmentConceptsKeys.all, filters],
  single: (id: string) => [...developmentConceptsKeys.all, id]
}

export function useEvent(opts: Getter<{ id: string }>) {
  return createQuery(() => ({
    queryKey: eventKeys.single(opts().id),
    queryFn: () => fetchEvent(opts().id)
  }))
}

export function useEvents(opts: Getter<ContentFilters & QueryOptions>) {
  const filters = useContentFilters()

  return createQuery(() => ({
    queryKey: eventKeys.list({
      ...filters.current,
      title: opts().title,
      page_size: opts().page_size,
      page: opts().page,
      sort: opts().sort,
      lang: opts().lang
    }),
    queryFn: () =>
      fetchEvents({
        title: opts().title ?? filters.current.title,
        page_size: opts().page_size ?? 20,
        page: opts().page ?? filters.current.page,
        sort: opts().sort ?? filters.current.sort,
        lang: opts().lang
      }),
    staleTime: opts().staleTime,
    placeholderData: keepPreviousData,
    enabled: opts().enabled
  }))
}

export function useUpdateEvent(opts: Getter<{ id: string }>) {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: (data: ContentForm) => patchEvent(opts().id, data),
    onSettled: () => {
      client.invalidateQueries({ queryKey: eventKeys.all })
    }
  }))
}

export function useDeleteEvents() {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: async (ids: number[]) => deleteEvents(ids),
    onSettled: () => {
      client.invalidateQueries({ queryKey: eventKeys.all })
    }
  }))
}

export function useCreateEvent() {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: (data: ContentForm) => postEvent(data),
    onSettled: () => {
      client.invalidateQueries({ queryKey: eventKeys.all })
    }
  }))
}

export function useBook(opts: Getter<{ id: string }>) {
  return createQuery(() => ({
    queryKey: booksKeys.single(opts().id),
    queryFn: () => fetchBook(opts().id)
  }))
}

export function useBooks(opts: Getter<ContentFilters & QueryOptions>) {
  const filters = useContentFilters()

  return createQuery(() => ({
    queryKey: booksKeys.list({
      ...filters.current,
      title: opts().title,
      page_size: opts().page_size,
      page: opts().page,
      sort: opts().sort,
      lang: opts().lang
    }),
    queryFn: () =>
      fetchBooks({
        title: opts().title ?? filters.current.title,
        page_size: opts().page_size ?? 20,
        page: opts().page ?? filters.current.page,
        sort: opts().sort ?? filters.current.sort,
        lang: opts().lang ?? filters.current.lang
      }),
    staleTime: opts().staleTime,
    placeholderData: keepPreviousData,
    enabled: opts().enabled
  }))
}

export function useDeleteBooks() {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: async (ids: number[]) => deleteBooks(ids),
    onSettled: () => {
      client.invalidateQueries({ queryKey: booksKeys.all })
    }
  }))
}

export function useCreateBook() {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: (data: ContentForm) => postBook(data),
    onSettled: () => {
      client.invalidateQueries({ queryKey: booksKeys.all })
    }
  }))
}

export function useUpdateBook(opts: Getter<{ id: string }>) {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: async (data: ContentForm) => patchBook(opts().id, data),
    onSettled: () => {
      client.invalidateQueries({ queryKey: booksKeys.all })
    }
  }))
}

export function useMediaArticle(opts: Getter<{ id: string }>) {
  return createQuery(() => ({
    queryKey: mediaArticlesKeys.single(opts().id),
    queryFn: () => fetchMediaArticle(opts().id)
  }))
}

export function useMediaArticles(opts: Getter<ContentFilters & QueryOptions>) {
  const filters = useContentFilters()

  return createQuery(() => ({
    queryKey: mediaArticlesKeys.list({
      ...filters.current,
      title: opts().title,
      page_size: opts().page_size,
      page: opts().page,
      sort: opts().sort,
      lang: opts().lang
    }),
    queryFn: () =>
      fetchMediaArticles({
        title: opts().title ?? filters.current.title,
        page_size: opts().page_size ?? 20,
        page: opts().page ?? filters.current.page,
        sort: opts().sort ?? filters.current.sort,
        lang: opts().lang ?? filters.current.lang
      }),
    staleTime: opts().staleTime,
    placeholderData: keepPreviousData,
    enabled: opts().enabled
  }))
}

export function useDeleteMediaArticles() {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: async (ids: number[]) => deleteRecords('media-articles', ids),
    onSettled: () => {
      client.invalidateQueries({ queryKey: mediaArticlesKeys.all })
    }
  }))
}

export function useUpdateMediaArticle(opts: Getter<{ id: string }>) {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: async (data: ContentFormSimple) =>
      patchMediaArticle(opts().id, data),
    onSettled: () => {
      client.invalidateQueries({ queryKey: mediaArticlesKeys.all })
    }
  }))
}

export function useHolocaustDocument(opts: Getter<{ id: string }>) {
  return createQuery(() => ({
    queryKey: holocaustDocumentsKeys.single(opts().id),
    queryFn: () => fetchHolocaustDocument(opts().id)
  }))
}

export function useHolocaustDocuments(
  opts: Getter<ContentFilters & QueryOptions>
) {
  const filters = useContentFilters()

  return createQuery(() => ({
    queryKey: holocaustDocumentsKeys.list({
      ...filters.current,
      title: opts().title,
      page_size: opts().page_size,
      page: opts().page,
      sort: opts().sort,
      lang: opts().lang
    }),
    queryFn: () =>
      fetchHolocaustDocuments({
        title: opts().title ?? filters.current.title,
        page_size: opts().page_size ?? 20,
        page: opts().page ?? filters.current.page,
        sort: opts().sort ?? filters.current.sort,
        lang: opts().lang ?? filters.current.lang
      }),
    staleTime: opts().staleTime,
    placeholderData: keepPreviousData,
    enabled: opts().enabled
  }))
}

export function useUpdateHolocaustDocument(opts: Getter<{ id: string }>) {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: (data: ContentFormSimple) =>
      patchHolocaustDocument(opts().id, data),
    onSettled: () => {
      client.invalidateQueries({ queryKey: holocaustDocumentsKeys.all })
    }
  }))
}

export function useCreateHolocaustDocument() {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: (data: ContentFormSimple) => postHolocaustDocument(data),
    onSettled: () => {
      client.invalidateQueries({ queryKey: holocaustDocumentsKeys.all })
    }
  }))
}

export function useDeleteHolocaustDocuments() {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: async (ids: number[]) =>
      deleteRecords('holocaust-documents', ids),
    onSettled: () => {
      client.invalidateQueries({ queryKey: holocaustDocumentsKeys.all })
    }
  }))
}

export function usePartner(opts: Getter<{ id: string }>) {
  return createQuery(() => ({
    queryKey: partnersKeys.single(opts().id),
    queryFn: () => fetchPartner(opts().id)
  }))
}

export function usePartners(opts: Getter<ContentFilters & QueryOptions>) {
  const filters = useContentFilters()

  return createQuery(() => ({
    queryKey: partnersKeys.list({
      ...filters.current,
      title: opts().title,
      page_size: opts().page_size,
      page: opts().page,
      sort: opts().sort,
      lang: opts().lang
    }),
    queryFn: () =>
      fetchPartners({
        title: opts().title ?? filters.current.title,
        page_size: opts().page_size ?? 20,
        page: opts().page ?? filters.current.page,
        sort: opts().sort ?? filters.current.sort,
        lang: opts().lang ?? filters.current.lang
      }),
    staleTime: opts().staleTime,
    placeholderData: keepPreviousData,
    enabled: opts().enabled
  }))
}

export function useUpdatePartner(opts: Getter<{ id: string }>) {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: (data: ContentFormSimple) => patchPartner(opts().id, data),
    onSettled: () => {
      client.invalidateQueries({ queryKey: partnersKeys.all })
    }
  }))
}

export function useCreatePartner() {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: (data: ContentFormSimple) => postPartner(data),
    onSettled: () => {
      client.invalidateQueries({ queryKey: partnersKeys.all })
    }
  }))
}

export function useDeletePartners() {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: async (ids: number[]) => deleteRecords('partners', ids),
    onSettled: () => {
      client.invalidateQueries({ queryKey: partnersKeys.all })
    }
  }))
}

export function useTestimony(opts: Getter<{ id: string }>) {
  return createQuery(() => ({
    queryKey: testimoniesKeys.single(opts().id),
    queryFn: () => fetchTestimony(opts().id)
  }))
}

export function useTestimonies(opts: Getter<ContentFilters & QueryOptions>) {
  const filters = useContentFilters()

  return createQuery(() => ({
    queryKey: testimoniesKeys.list({
      ...filters.current,
      title: opts().title,
      page_size: opts().page_size,
      page: opts().page,
      sort: opts().sort,
      lang: opts().lang
    }),
    queryFn: () =>
      fetchTestimonies({
        title: opts().title ?? filters.current.title,
        page_size: opts().page_size ?? 20,
        page: opts().page ?? filters.current.page,
        sort: opts().sort ?? filters.current.sort,
        lang: opts().lang ?? filters.current.lang
      }),
    staleTime: opts().staleTime,
    placeholderData: keepPreviousData,
    enabled: opts().enabled
  }))
}

export function useUpdateTestimony(opts: Getter<{ id: string }>) {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: (data: ContentFormSimple) => patchTestimony(opts().id, data),
    onSettled: () => {
      client.invalidateQueries({ queryKey: testimoniesKeys.all })
    }
  }))
}

export function useCreateTestimony() {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: (data: ContentFormSimple) => postTestimony(data),
    onSettled: () => {
      client.invalidateQueries({ queryKey: testimoniesKeys.all })
    }
  }))
}

export function useCreateMediaArticle() {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: (data: ContentFormSimple) => postMediaArticle(data),
    onSettled: () => {
      client.invalidateQueries({ queryKey: mediaArticlesKeys.all })
    }
  }))
}

export function useDeleteTestimonies() {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: async (ids: number[]) =>
      deleteRecords('victim-testimonies', ids),
    onSettled: () => {
      client.invalidateQueries({ queryKey: testimoniesKeys.all })
    }
  }))
}

export function useLegalDocument(opts: Getter<{ id: string }>) {
  return createQuery(() => ({
    queryKey: legalDocumentsKeys.single(opts().id),
    queryFn: () => fetchLegalDocument(opts().id)
  }))
}

export function useLegalDocuments(opts: Getter<ContentFilters & QueryOptions>) {
  const filters = useContentFilters()

  return createQuery(() => ({
    queryKey: legalDocumentsKeys.list({
      ...filters.current,
      title: opts().title,
      page_size: opts().page_size,
      page: opts().page,
      sort: opts().sort,
      lang: opts().lang
    }),
    queryFn: () =>
      fetchLegalDocuments({
        title: opts().title ?? filters.current.title,
        page_size: opts().page_size ?? 20,
        page: opts().page ?? filters.current.page,
        sort: opts().sort ?? filters.current.sort,
        lang: opts().lang ?? filters.current.lang
      }),
    staleTime: opts().staleTime,
    placeholderData: keepPreviousData,
    enabled: opts().enabled
  }))
}

export function useUpdateLegalDocument(opts: Getter<{ id: string }>) {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: (data: ContentForm) => patchLegalDocument(opts().id, data),
    onSettled: () => {
      client.invalidateQueries({ queryKey: legalDocumentsKeys.all })
    }
  }))
}

export function useCreateLegalDocument() {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: (data: ContentForm) => postLegalDocument(data),
    onSettled: () => {
      client.invalidateQueries({ queryKey: legalDocumentsKeys.all })
    }
  }))
}

export function useDeleteLegalDocuments() {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: async (ids: number[]) => deleteRecords('legal-documents', ids),
    onSettled: () => {
      client.invalidateQueries({ queryKey: legalDocumentsKeys.all })
    }
  }))
}

export function useDevelopmentConcept(opts: Getter<{ id: string }>) {
  return createQuery(() => ({
    queryKey: developmentConceptsKeys.single(opts().id),
    queryFn: () => fetchDevelopmentConcept(opts().id)
  }))
}

export function useDevelopmentConcepts(
  opts: Getter<ContentFilters & QueryOptions>
) {
  const filters = useContentFilters()

  return createQuery(() => ({
    queryKey: developmentConceptsKeys.list({
      ...filters.current,
      title: opts().title,
      page_size: opts().page_size,
      page: opts().page,
      sort: opts().sort,
      lang: opts().lang
    }),
    queryFn: () =>
      fetchDevelopmentConcepts({
        title: opts().title ?? filters.current.title,
        page_size: opts().page_size ?? 20,
        page: opts().page ?? filters.current.page,
        sort: opts().sort ?? filters.current.sort,
        lang: opts().lang ?? filters.current.lang
      }),
    staleTime: opts().staleTime,
    placeholderData: keepPreviousData,
    enabled: opts().enabled
  }))
}

export function useUpdateDevelopmentConcept(opts: Getter<{ id: string }>) {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: (data: ContentFormSimple) =>
      patchDevelopmentConcept(opts().id, data),
    onSettled: () => {
      client.invalidateQueries({ queryKey: developmentConceptsKeys.all })
    }
  }))
}

export function useCreateDevelopmentConcept() {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: (data: ContentFormSimple) => postDevelopmentConcept(data),
    onSettled: () => {
      client.invalidateQueries({ queryKey: developmentConceptsKeys.all })
    }
  }))
}

export function useDeleteDevelopmentConcepts() {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: async (ids: number[]) =>
      deleteRecords('development-concepts', ids),
    onSettled: () => {
      client.invalidateQueries({ queryKey: developmentConceptsKeys.all })
    }
  }))
}
