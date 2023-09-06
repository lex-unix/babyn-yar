import { defineCollection, z } from 'astro:content'
import { siteCollectionSchema, eventSchema } from 'content-schema'

const siteCollection = defineCollection({
  schema: siteCollectionSchema
})

const eventsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    events: z.array(eventSchema)
  })
})

export const collections = {
  site: siteCollection,
  events: eventsCollection
}
