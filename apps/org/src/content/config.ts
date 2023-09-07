import { defineCollection, z } from 'astro:content'
import {
  siteCollectionSchema,
  eventSchema,
  testimoniesSchema,
  legislativeBasisSchema,
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

const legislativeBasisCollection = defineCollection({
  type: 'data',
  schema: z.object({
    legislativeBasis: z.array(legislativeBasisSchema)
  })
})

export const collections = {
  site: siteCollection,
  events: eventsCollection,
  'legislative-basis': legislativeBasisCollection,
  testimonies: testimoniesCollection,
  library: libraryCollection
}
