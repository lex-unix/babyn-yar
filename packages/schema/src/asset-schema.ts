import { Metadata } from './metadata'
import * as v from 'valibot'

export namespace AssetSchema {
  export const Asset = v.object({
    id: v.number(),
    url: v.string(),
    fileName: v.string(),
    contentType: v.string(),
    createdAt: v.string()
  })

  export const Form = v.object({
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

  export const ListResponse = v.object({
    assets: v.array(Asset),
    metadata: v.union([Metadata, v.record(v.string(), v.any())])
  })

  export const FormResponse = v.object({
    assets: v.array(Asset)
  })

  export const Filters = v.object({
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
  export type Form = v.InferInput<typeof Form>
  export type FormResponse = v.InferOutput<typeof FormResponse>
  export type ListResponse = v.InferOutput<typeof ListResponse>
  export type Filters = v.InferInput<typeof Filters>
}
