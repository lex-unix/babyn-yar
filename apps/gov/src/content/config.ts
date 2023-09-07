import { defineCollection, z } from 'astro:content'
import {
  siteCollectionSchema,
  eventSchema,
  librarySchema
} from 'content-schema'

const siteColletion = defineCollection({
  schema: siteCollectionSchema
})

const eventsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    events: z.array(eventSchema)
  })
})

const libraryCollection = defineCollection({
  type: 'data',
  schema: z.object({
    library: z.array(librarySchema)
  })
})

export const collections = {
  site: siteColletion,
  events: eventsCollection,
  library: libraryCollection
}
