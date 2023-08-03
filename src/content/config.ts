import { defineCollection, z } from 'astro:content'

const baseCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string()
  })
})

const eventSchema = z.object({
  title: z.string(),
  slug: z.string(),
  image: z.string()
})

const dataCollection = defineCollection({
  type: 'data',
  schema: z.object({
    uk: z.array(eventSchema),
    en: z.array(eventSchema)
  })
})

export type EventData = z.infer<typeof eventSchema>

export const collections = {
  site: baseCollection,
  data: dataCollection
}
