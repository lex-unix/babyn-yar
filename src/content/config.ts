import { defineCollection, z } from 'astro:content'

const baseCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string()
  })
})

export const collections = {
  site: baseCollection
}
