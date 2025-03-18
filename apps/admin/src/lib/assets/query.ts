import {
  createInfiniteQuery,
  createMutation,
  type CreateInfiniteQueryOptions,
  type InfiniteData
} from '@tanstack/svelte-query'
import { derived, get } from 'svelte/store'
import { deleteAssets, fetchAssets, uploadAssets } from './api'
import type { Asset, Metadata } from '$lib/types'
import { ResponseError } from '$lib/response-error'
import { queryClient } from '$query/client'
import { addToast } from '$components/Toaster.svelte'
import { urlFilters } from '$lib/url-params'
import { assetToasts } from './toast'

export const assetKeys = {
  all: ['assets'] as const,
  list: (filters: string) => [...assetKeys.all, filters]
}

type AssetsResponse = {
  assets: Asset[]
  metadata: Metadata
}

export function useAssets() {
  return createInfiniteQuery(
    derived(urlFilters, $urlFilters => {
      return {
        initialPageParam: 1,
        queryKey: assetKeys.list($urlFilters),
        queryFn: async ({ pageParam = 1, queryKey }) => {
          const filters = queryKey[1] as string
          return fetchAssets(pageParam as number, filters)
        },
        getNextPageParam: lastPage => {
          if (lastPage.metadata.currentPage >= lastPage.metadata.lastPage) {
            return undefined
          }
          return lastPage.metadata.currentPage + 1
        }
      } as CreateInfiniteQueryOptions<
        AssetsResponse,
        Error,
        InfiniteData<AssetsResponse>
      >
    })
  )
}

export function useUploadAssets() {
  return createMutation<{ assets: Asset[] }, ResponseError, FormData>({
    mutationFn: async assets => {
      return uploadAssets(assets)
    },
    onSuccess: response => {
      addToast(assetToasts.uploadSuccess)
      queryClient.setQueryData(
        assetKeys.list(get(urlFilters)),
        (data: InfiniteData<AssetsResponse>) => {
          const firstPage = data?.pages[0]
          if (!firstPage) return data
          return {
            ...data,
            pages: [
              {
                ...firstPage,
                assets: [...response.assets, ...firstPage.assets]
              },
              ...data.pages.slice(1)
            ]
          }
        }
      )

      queryClient.invalidateQueries({
        queryKey: assetKeys.all,
        refetchType: 'none'
      })
    },
    onError: error => {
      let toastMessage = 'Спробуйте, будь ласка, ще раз'
      if (error instanceof ResponseError && error.isFormError()) {
        const existingFiles = Object.keys(error.error).join(', ')
        toastMessage = `Файли вже існують: ${existingFiles}`
      }
      addToast(assetToasts.uploadError(toastMessage))
    }
  })
}

export function useDeleteAssets() {
  return createMutation<unknown, ResponseError, number[]>({
    mutationFn: ids => {
      return deleteAssets(ids)
    },
    onSuccess: () => {
      addToast(assetToasts.deleteSuccess)
      queryClient.invalidateQueries({ queryKey: assetKeys.all })
    },
    onError: () => {
      addToast(assetToasts.deleteError)
    }
  })
}
