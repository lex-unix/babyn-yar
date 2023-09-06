import { defineCollection, z } from 'astro:content'
import { siteCollectionSchema, eventSchema } from 'content-schema'

const siteColletion = defineCollection({
  schema: siteCollectionSchema
})

const eventsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    events: z.array(eventSchema)
  })
})

export const collections = {
  site: siteColletion,
  events: eventsCollection
}
