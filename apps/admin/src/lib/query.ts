import { PUBLIC_API_URL } from '$env/static/public'
import {
  createInfiniteQuery,
  createMutation,
  type CreateInfiniteQueryOptions,
  type InfiniteData,
  createQuery,
  keepPreviousData,
  type CreateQueryOptions
} from '@tanstack/svelte-query'
import type { Content, CreateContent, Metadata } from './types'
import { derived, type Readable } from 'svelte/store'
import type { ResponseError } from './response-error'
import { urlWithSearchParams } from './url-params'
import { fetcher } from './fetcher'
import { queryClient } from '$query/client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

type ContentResponse = {
  content: Content[]
  metadata: Metadata
}

type TranslationsResponse = {
  translations: Content[]
  metadata: Metadata
}

export function createContentQuery(
  contentType: Readable<string>,
  filters: Readable<Record<string, string | number>>
) {
  return createQuery<ContentResponse, ResponseError>(
    derived([filters, contentType], ([$filters, $contentType]) => {
      return {
        placeholderData: keepPreviousData,
        queryKey: [
          'content',
          $contentType,
          {
            page: $filters.page,
            page_size: $filters.pageSize,
            sort: $filters.sort,
            title: $filters.search
          }
        ],
        queryFn: ({ queryKey }) => {
          return fetcher(
            urlWithSearchParams(PUBLIC_API_URL + '/content', {
              ...(queryKey[2] as Record<string, string | number>),
              content_type: queryKey[1] as string
            })
          )
        }
      } as CreateQueryOptions<ContentResponse, ResponseError>
    })
  )
}

export function createContentByIdQuery(id: Readable<string>) {
  return createQuery(
    derived(id, $id => {
      return {
        queryKey: ['contentById', $id],
        queryFn: ({ queryKey }) => {
          const id = queryKey[1] as string
          return fetcher(PUBLIC_API_URL + `/content/${id}`)
        }
      } as CreateQueryOptions<{ content: Content }, ResponseError>
    })
  )
}

export function createContentMutation() {
  return createMutation<{ content: Content }, ResponseError, CreateContent>({
    mutationFn: content => {
      return fetcher(PUBLIC_API_URL + '/content', {
        method: 'POST',
        body: JSON.stringify({
          ...content,
          content: JSON.stringify(content.content)
        })
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
    }
  })
}

export function createContentdDeleteMutation() {
  return createMutation<Record<string, string>, ResponseError, number[]>({
    mutationFn: (ids: number[]) => {
      return fetcher(PUBLIC_API_URL + `/content?ids=${ids.join(',')}`, {
        method: 'DELETE'
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
    }
  })
}

export function createTranslationsQuery(
  filters: Readable<Record<string, string | number>>
) {
  return createInfiniteQuery(
    derived(filters, $filters => {
      return {
        initialPageParam: 1,
        placeholderData: keepPreviousData,
        queryKey: [
          'translations',
          { lang: $filters.lang, title: $filters.search }
        ],
        queryFn: async ({ pageParam = 1, queryKey }) => {
          return fetcher(
            urlWithSearchParams(PUBLIC_API_URL + '/content/translations', {
              ...(queryKey[1] as Record<string, string>),
              content_type: 'events',
              page: pageParam as number
            })
          )
        },
        getNextPageParam: lastPage => {
          if (lastPage.metadata.currentPage >= lastPage.metadata.lastPage) {
            return undefined
          }
          return lastPage.metadata.currentPage + 1
        }
      } as CreateInfiniteQueryOptions<
        TranslationsResponse,
        Error,
        InfiniteData<TranslationsResponse>
      >
    })
  )
}
