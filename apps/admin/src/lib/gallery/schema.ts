import * as v from 'valibot'

export type GalleryImage = v.InferInput<typeof GalleryImage>
export const GalleryImage = v.object({
  id: v.number(),
  createadAt: v.string(),
  url: v.pipe(v.string(), v.url())
})
