import type { Asset, Metadata } from './types'

type GetAssetsRespone = {
  assets: Asset[]
  metadata: Metadata
}

type Filters = {
  filename?: string
  sort?: string
}

export async function fetchAssets(contentType: string, filters?: Filters) {
  const url = new URL('http://localhost:8000/v1/assets')

  url.searchParams.set('content_type', contentType)

  if (filters?.filename) {
    url.searchParams.set('filename', filters.filename)
  } else {
    url.searchParams.delete('filename')
  }

  if (filters?.sort) {
    url.searchParams.set('sort', filters.sort)
  } else {
    url.searchParams.delete('sort')
  }

  const response = await fetch(url)
  const json: GetAssetsRespone = await response.json()
  return json
}

export async function createAssets(formData: FormData) {
  const baseUrl = 'http://localhost:8000/v1/assets'
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      body: formData
    })
    if (!response.ok) {
      const { error } = await response.json()
      return { ok: false as const, error }
    } else {
      return { ok: true as const }
    }
  } catch (e) {
    console.log(e)
    return { ok: false as const }
  }
}
