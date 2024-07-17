import { defineCollection } from 'astro:content'
import { siteCollectionSchema } from 'content-schema'

const siteCollection = defineCollection({
  schema: siteCollectionSchema
})

export const collections = {
  site: siteCollection
}
