import * as v from 'valibot'
import { UserSchema } from './user-schema'

export namespace ContentSchema {
  v.setGlobalConfig({ lang: 'uk' })

  const BaseContent = v.object({
    title: v.pipe(v.string(), v.nonEmpty()),
    occuredOn: v.string(),
    description: v.pipe(v.string(), v.nonEmpty()),
    lang: v.picklist(['ua', 'en']),
    cover: v.pipe(v.string(), v.url()),
    documents: v.array(v.pipe(v.string(), v.url())),
    content: v.any()
  })

  export const Translation = v.object({
    id: v.number(),
    englishId: v.number(),
    englishTitle: v.string(),
    ukrainianId: v.number(),
    ukrainianTitle: v.string()
  })

  export const Content = v.object({
    id: v.number(),
    createdAt: v.string(),
    updatedAt: v.string(),
    version: v.number(),
    user: UserSchema.User,
    ...BaseContent.entries
  })

  export const FormSimple = v.pipe(
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

  export const Form = v.pipe(
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

  export const Filters = v.object({
    title: v.optional(v.string()),
    page: v.optional(v.number()),
    page_size: v.optional(v.number()),
    lang: v.optional(v.picklist(['en', 'ua'])),
    sort: v.optional(
      v.picklist(['created_at', '-created_at', 'occured_on', '-occured_on'])
    )
  })

  export type Translation = v.InferOutput<typeof Translation>
  export type Content = v.InferOutput<typeof Content>
  export type FormSimple = v.InferInput<typeof FormSimple>
  export type Form = v.InferInput<typeof Form>
  export type Filters = v.InferInput<typeof Filters>
}
