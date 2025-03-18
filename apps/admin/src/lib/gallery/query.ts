import { createMutation, createQuery } from '@tanstack/svelte-query'
import {
  createGalleryImage,
  deleteGalleryImage,
  fetchGalleryImages
} from './api'
import type { GalleryImage } from '$lib/types'
import type { ResponseError } from '$lib/response-error'
import { queryClient } from '$query/client'
import { addToast } from '$components/Toaster.svelte'
import { galleryToasts } from './toast'

const galleryKeys = {
  all: ['gallery'] as const
}

type GalleryResponse = {
  images: GalleryImage[]
}

export function useGalleryImages() {
  return createQuery<GalleryResponse>({
    queryKey: galleryKeys.all,
    queryFn: () => {
      return fetchGalleryImages()
    }
  })
}

export function useCreateGalleryImage() {
  return createMutation<
    { image: GalleryImage },
    ResponseError,
    { url: string; id: number }
  >({
    mutationFn: image => {
      return createGalleryImage(image)
    },
    onSuccess: newImage => {
      addToast(galleryToasts.createSuccess)
      queryClient.setQueryData(galleryKeys.all, (data: GalleryResponse) => {
        return {
          images: [...data.images, newImage.image]
        }
      })
    },
    onError: () => {
      addToast(galleryToasts.createError)
    }
  })
}

export function useDeleteGalleryImage() {
  return createMutation<Record<string, string>, ResponseError, number>({
    mutationFn: id => {
      return deleteGalleryImage(id)
    },
    onSuccess: (_, deletedId) => {
      addToast(galleryToasts.deleteSuccess)
      queryClient.setQueryData(galleryKeys.all, (data: GalleryResponse) => ({
        images: data.images.filter(i => i.id !== deletedId)
      }))
    },
    onError: () => {
      addToast(galleryToasts.deleteError)
    }
  })
}
