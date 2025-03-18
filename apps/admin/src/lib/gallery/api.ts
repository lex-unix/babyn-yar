import { PUBLIC_API_URL } from '$env/static/public'
import { fetcher } from '$lib/fetcher'

export async function fetchGalleryImages() {
  return fetcher(`${PUBLIC_API_URL}/gallery`)
}

export async function createGalleryImage(image: { url: string; id: number }) {
  return fetcher(`${PUBLIC_API_URL}/gallery`, {
    method: 'POST',
    body: JSON.stringify(image)
  })
}

export async function deleteGalleryImage(id: number) {
  return fetcher(`${PUBLIC_API_URL}/gallery/${id}`, { method: 'DELETE' })
}
