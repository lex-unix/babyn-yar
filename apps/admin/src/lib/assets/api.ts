import { PUBLIC_API_URL } from '$env/static/public'
import { fetcher } from '$lib/fetcher'

export async function fetchAssets(page: number, filters: string) {
  const params = new URLSearchParams(filters)
  params.set('page', page.toString())
  params.set('page_size', '50')
  const url = `${PUBLIC_API_URL}/assets?${params.toString()}`
  return fetcher(url)
}

export async function uploadAssets(assets: FormData) {
  return fetcher(`${PUBLIC_API_URL}/assets`, {
    method: 'POST',
    body: assets
  })
}

export async function deleteAssets(ids: number[]) {
  return fetcher(`${PUBLIC_API_URL}/assets?ids=${ids.join(',')}`, {
    method: 'DELETE'
  })
}
