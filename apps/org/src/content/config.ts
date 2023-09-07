import { defineCollection, z } from 'astro:content'
import {
  siteCollectionSchema,
  eventSchema,
  testimoniesSchema,
  librarySchema
} from 'content-schema'

const siteCollection = defineCollection({
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

const testimoniesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    testimonies: z.array(testimoniesSchema)
  })
})

export const collections = {
  site: siteCollection,
  events: eventsCollection,
  testimonies: testimoniesCollection,
  library: libraryCollection
}
