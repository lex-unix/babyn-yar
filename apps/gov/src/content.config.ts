import { glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'
import { siteCollectionSchema } from 'content-schema'

const siteCollection = defineCollection({
  loader: glob({ pattern: '**/*.{mdx,md}', base: './src/content/site' }),
  schema: siteCollectionSchema
})

export const collections = {
  site: siteCollection
}
