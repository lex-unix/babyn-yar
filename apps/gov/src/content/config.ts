import { defineCollection, z } from 'astro:content'
import {
  siteCollectionSchema,
  eventSchema,
  librarySchema,
  holocaustDocumentsSchema,
  testimoniesSchema,
  legislativeBasisSchema,
  exhibitionsSchema
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

const holocaustDocumentsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    documents: z.array(holocaustDocumentsSchema)
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

const exhibitionsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    exhibitions: z.array(exhibitionsSchema)
  })
})

export const collections = {
  site: siteColletion,
  events: eventsCollection,
  library: libraryCollection,
  'holocaust-documents': holocaustDocumentsCollection,
  testimonies: testimoniesCollection,
  'legislative-basis': legislativeBasisCollection,
  exhibitions: exhibitionsCollection
}
