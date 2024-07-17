import { z } from 'zod'

const baseSchema = z.object({
  type: z.literal('base').optional().default('base'),
  title: z.string(),
  description: z.string()
})

const compactSchema = baseSchema.extend({
  type: z.literal('compact')
})

export const siteCollectionSchema = z.union([baseSchema, compactSchema])

export const legislativeBasisSchema = z.object({
  title: z.string(),
  imgSrc: z.string(),
  href: z.string()
})

export type LegislativeBasisData = z.infer<typeof legislativeBasisSchema>
