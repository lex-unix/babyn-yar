import { PUBLIC_API_URL } from '$env/static/public'
import { fetcher } from '$lib/fetcher'

function trimRight(str: string, char: string) {
  return str.replace(new RegExp(`${char}+$`), '')
}

export async function fetchAssets(page: number, filters: string) {
  const url = `${PUBLIC_API_URL}/assets?page_size=50&page=${page}&${filters}`
  return fetcher(trimRight(url, '&'))
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
