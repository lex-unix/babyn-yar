import { PUBLIC_API_URL } from '$env/static/public'
import { fetcher } from '$lib/fetcher'
import type { Metadata } from '$lib/pagination/schema'
import type { Asset, AssetFilters, AssetsForm } from './schema'

type AssetsResponse = {
  assets: Asset[]
  metadata: Metadata
}

export async function fetchAssets(
  page: number,
  filters: AssetFilters
): Promise<AssetsResponse> {
  const params = new URLSearchParams(filters)
  params.set('page', page.toString())
  params.set('page_size', '50')
  const url = `${PUBLIC_API_URL}/assets?${params.toString()}`
  return fetcher(url)
}

export async function uploadAssets(
  form: AssetsForm
): Promise<{ assets: Asset[] }> {
  const formData = new FormData()

  form.files.forEach(({ file, fileName, extension }) => {
    const prefix = form.prefix ? form.prefix + '_' : ''
    const fullName = `${prefix}${fileName}.${extension}`
    formData.append('assets', file, fullName)
  })

  return fetcher(`${PUBLIC_API_URL}/assets`, {
    method: 'POST',
    body: formData
  })
}

export async function deleteAssets(ids: number[]) {
  return fetcher(`${PUBLIC_API_URL}/assets?ids=${ids.join(',')}`, {
    method: 'DELETE'
  })
}
