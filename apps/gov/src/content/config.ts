import { defineCollection } from 'astro:content'
import { siteCollectionSchema } from 'content-schema'

const siteColletion = defineCollection({
  schema: siteCollectionSchema
})

export const collections = {
  site: siteColletion
}
