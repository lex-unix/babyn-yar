import { z } from 'zod'

export const siteCollectionSchema = z.object({
  type: z.literal('base').optional().default('base'),
  title: z.string(),
  description: z.string()
})

export const eventSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  image: z.string(),
  featured: z.boolean().default(false)
})

export type EventData = z.infer<typeof eventSchema>
