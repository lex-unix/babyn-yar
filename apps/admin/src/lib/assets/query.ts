import {
  createInfiniteQuery,
  createMutation,
  keepPreviousData,
  useQueryClient
} from '@tanstack/svelte-query'
import { deleteAssets, fetchAssets, uploadAssets } from './api'
import { ResponseError } from '$lib/response-error'
import { assetToasts } from './toast'
import type { Getter } from '$lib/runes'
import { AssetFilters, AssetsForm } from './schema'
import { useAssetFilters } from '$lib/use-asset-filters'

type QueryOptions = {
  staleTime?: number
  enabled?: boolean
}

export const assetKeys = {
  all: ['assets'] as const,
  list: (filters: AssetFilters) => [...assetKeys.all, filters]
}

export function useAssets(opts: Getter<QueryOptions>) {
  const filters = useAssetFilters()

  return createInfiniteQuery(() => ({
    initialPageParam: 1,
    queryKey: assetKeys.list(filters.current),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 10,
    enabled: opts().enabled,
    queryFn: async ({ pageParam = 1 }) =>
      fetchAssets(pageParam, filters.current),
    getNextPageParam: lastPage => {
      if (lastPage.metadata.currentPage >= lastPage.metadata.lastPage) {
        return undefined
      }
      return lastPage.metadata.currentPage + 1
    }
  }))
}

export function useUploadAssets() {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: async (assets: AssetsForm) => uploadAssets(assets),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: assetKeys.all })
    }
  }))
}

export function useDeleteAssets() {
  const client = useQueryClient()

  return createMutation<unknown, ResponseError, number[]>(() => ({
    mutationFn: ids => {
      return deleteAssets(ids)
    },
    onSettled: () => {
      client.invalidateQueries({ queryKey: assetKeys.all })
    },
    onSuccess: () => {
      assetToasts.deleteSuccess()
    },
    onError: () => {
      assetToasts.deleteError()
    }
  }))
}
