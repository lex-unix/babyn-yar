import * as v from 'valibot'

export type GalleryImage = v.InferInput<typeof GalleryImage>
export const GalleryImage = v.object({
  id: v.number(),
  createadAt: v.string(),
  url: v.pipe(v.string(), v.url())
})

export namespace GallerySchema {
  export const Image = v.object({
    id: v.number(),
    createdAt: v.string(),
    url: v.pipe(v.string(), v.url())
  })

  export const ListResponse = v.object({
    images: v.array(Image)
  })

  export const DetailRespone = v.object({
    image: Image
  })

  export const Form = v.object({
    url: v.pipe(v.string(), v.string()),
    id: v.number()
  })

  export type Image = v.InferInput<typeof Image>
  export type ListResponse = v.InferOutput<typeof ListResponse>
  export type DetailRespone = v.InferInput<typeof DetailRespone>
  export type Form = v.InferInput<typeof Form>
}
