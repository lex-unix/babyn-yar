import {
  createMutation,
  createQuery,
  useQueryClient
} from '@tanstack/svelte-query'
import {
  createGalleryImage,
  deleteGalleryImage,
  fetchGalleryImages
} from './api'
import type { GalleryImage } from './schema'

const galleryKeys = {
  all: ['gallery'] as const
}

export function useGalleryImages() {
  return createQuery(() => ({
    queryKey: galleryKeys.all,
    queryFn: () => {
      return fetchGalleryImages()
    }
  }))
}

export function useCreateGalleryImage() {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: (image: { url: string; id: number }) => {
      return createGalleryImage(image)
    },
    onSettled: () => {
      client.invalidateQueries({ queryKey: galleryKeys.all })
    }
  }))
}

export function useDeleteGalleryImage() {
  const client = useQueryClient()

  return createMutation(() => ({
    mutationFn: (id: number) => {
      return deleteGalleryImage(id)
    },
    onMutate: async id => {
      await client.cancelQueries({ queryKey: galleryKeys.all })
      const prevGallery = client.getQueryData<{ images: GalleryImage[] }>(
        galleryKeys.all
      )

      if (!prevGallery) return prevGallery

      client.setQueryData<{ images: GalleryImage[] }>(galleryKeys.all, old => {
        if (!old) return old
        return {
          images: old.images.filter(image => image.id !== id)
        }
      })

      return { prevGallery }
    },
    onSettled: () => {
      client.invalidateQueries({ queryKey: galleryKeys.all })
    },
    onError: (error, _id, context) => {
      console.error(error)
      if (context?.prevGallery) {
        client.setQueryData(galleryKeys.all, context.prevGallery)
      }
    }
  }))
}
