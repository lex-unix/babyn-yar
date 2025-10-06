import { Metadata } from '$lib/pagination/schema'
import * as v from 'valibot'

export type AssetsForm = v.InferInput<typeof AssetsForm>
export const AssetsForm = v.object({
  prefix: v.string(),
  files: v.pipe(
    v.array(
      v.object({
        file: v.file(),
        extension: v.string(),
        fileName: v.pipe(v.string(), v.nonEmpty())
      })
    ),
    v.minLength(1)
  )
})

export const Asset = v.object({
  id: v.number(),
  url: v.string(),
  fileName: v.string(),
  contentType: v.string(),
  createdAt: v.string()
})

export const PaginatedAssetsResponse = v.object({
  assets: v.array(Asset),
  metadata: v.union([Metadata, v.record(v.string(), v.any())])
})

export const AssetsResponse = v.object({
  assets: v.array(Asset)
})

export const AssetFilters = v.object({
  filename: v.optional(v.string()),
  content_type: v.optional(v.string()),
  sort: v.optional(
    v.union([
      v.literal('created_at'),
      v.literal('-created_at'),
      v.literal('file_name'),
      v.literal('-file_name')
    ])
  )
})

export type Asset = v.InferOutput<typeof Asset>
export type AssetsResponse = v.InferOutput<typeof AssetsResponse>
export type PaginatedAssetsResponse = v.InferOutput<
  typeof PaginatedAssetsResponse
>
export type AssetFilters = v.InferInput<typeof AssetFilters>
