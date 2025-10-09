import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const baseSchema = z.object({
  type: z.literal('base').optional().default('base'),
  title: z.string(),
  description: z.string()
})

const compactSchema = baseSchema.extend({
  type: z.literal('compact')
})

const siteCollection = defineCollection({
  loader: glob({ pattern: '**/*.{mdx,md}', base: './src/content/site' }),
  schema: z.union([baseSchema, compactSchema])
})

export const collections = {
  site: siteCollection
}
