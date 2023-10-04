import { PUBLIC_API_URL } from '$env/static/public'
import type { Asset, Metadata } from './types'

type GetAssetsRespone = {
  assets: Asset[]
  metadata: Metadata
}

type Filters = {
  contentType?: string
  filename?: string
  sort?: string
}

type Error422 = {
  error: Record<string, string>
}

const baseUrl = PUBLIC_API_URL + '/assets'

export function fetchAssetsWrapper() {
  const searchParams = new URLSearchParams()

  return async (filters?: Filters) => {
    const url = new URL(baseUrl)

    if (filters?.contentType !== undefined) {
      searchParams.set('content_type', filters.contentType)
    }

    if (filters?.filename !== undefined) {
      searchParams.set('filename', filters.filename)
    }

    if (filters?.sort !== undefined) {
      searchParams.set('sort', filters.sort)
    }

    url.search = searchParams.toString()

    const response = await fetch(url)
    const json: GetAssetsRespone = await response.json()
    return json
  }
}

export async function fetchAssets(contentType: string, filters?: Filters) {
  const url = new URL(baseUrl)

  url.searchParams.set('content_type', contentType)

  if (filters?.filename !== undefined) {
    url.searchParams.set('filename', filters.filename)
  }

  if (filters?.sort !== undefined) {
    url.searchParams.set('sort', filters.sort)
  }

  const response = await fetch(url)
  const json: GetAssetsRespone = await response.json()
  return json
}

export async function createAssets(formData: FormData) {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      body: formData
    })
    if (!response.ok) {
      const json = await response.json()
      if (response.status === 422) {
        console.log(Object.keys(json.error))
        let error = 'Файли вже існують: '
        error += Object.keys(json.error as Error422).join(', ')
        return { ok: false as const, error }
      }
      const error = json.error as string
      return { ok: false as const, error }
    } else {
      return { ok: true as const }
    }
  } catch (e) {
    console.log(e)
    return { ok: false as const, error: 'Спробуйте ще раз' }
  }
}
