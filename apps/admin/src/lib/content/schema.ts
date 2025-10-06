import { User } from '$lib/users/schema'
import * as v from 'valibot'

export type ContentFilters = v.InferInput<typeof ContentFilters>
export const ContentFilters = v.object({
  title: v.optional(v.string()),
  page: v.optional(v.number()),
  page_size: v.optional(v.number()),
  lang: v.optional(v.picklist(['en', 'ua'])),
  sort: v.optional(
    v.picklist(['created_at', '-created_at', 'occured_on', '-occured_on'])
  )
})

export type Translation = v.InferInput<typeof Translation>
export const Translation = v.object({
  id: v.number(),
  englishId: v.number(),
  englishTitle: v.string(),
  ukrainianId: v.number(),
  ukrainianTitle: v.string()
})

const BaseContent = v.object({
  title: v.pipe(v.string(), v.nonEmpty()),
  occuredOn: v.string(),
  description: v.pipe(v.string(), v.nonEmpty()),
  lang: v.picklist(['ua', 'en']),
  cover: v.pipe(v.string(), v.url()),
  documents: v.array(v.pipe(v.string(), v.url())),
  content: v.any()
})

export type Content = v.InferInput<typeof Content>
export const Content = v.object({
  id: v.number(),
  createdAt: v.string(),
  updatedAt: v.string(),
  version: v.number(),
  translation: Translation,
  user: User,
  ...BaseContent.entries
})

export type ContentFormSimple = v.InferInput<typeof ContentFormSimple>
export const ContentFormSimple = v.pipe(
  v.object({
    ...v.omit(BaseContent, ['documents']).entries,
    translation: v.optional(
      v.object({
        id: v.number(),
        title: v.string()
      })
    )
  }),
  v.transform(input => ({
    title: input.title,
    occuredOn: new Date(input.occuredOn).toISOString(),
    description: input.description,
    lang: input.lang,
    cover: input.cover,
    content: JSON.stringify(input.content),
    translationId: input.translation?.id
  }))
)

export type ContentForm = v.InferInput<typeof ContentForm>
export const ContentForm = v.pipe(
  v.object({
    ...BaseContent.entries,
    translation: v.optional(
      v.object({
        id: v.number(),
        title: v.string()
      })
    )
  }),
  v.transform(input => ({
    title: input.title,
    occuredOn: new Date(input.occuredOn).toISOString(),
    description: input.description,
    lang: input.lang,
    cover: input.cover,
    documents: input.documents,
    content: JSON.stringify(input.content),
    translationId: input.translation?.id
  }))
)
