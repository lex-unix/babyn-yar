import { PUBLIC_API_URL } from '$env/static/public'
import { ResponseError } from './response-error'
import type { Asset, Metadata } from './types'

type PaginatedResponse = {
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
  const url = new URL(baseUrl)
  const searchParams = new URLSearchParams()
  searchParams.set('page_size', '20')

  return async (filters?: Filters, page: number = 1) => {
    searchParams.set('page', `${page}`)

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

    try {
      const response = await fetch(url, { credentials: 'include' })
      const json = await response.json()
      if (response.ok) {
        return { ok: true as const, data: json as PaginatedResponse }
      }
      const error = new ResponseError(response.status, json.error)
      return { ok: false as const, error }
    } catch (e) {
      console.log(e)
      const error = new ResponseError(500, 'the server encountered an error')
      return { ok: false as const, error }
    }
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
  const json: PaginatedResponse = await response.json()
  return json
}

export async function createAssets(formData: FormData) {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      body: formData,
      credentials: 'include'
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

export async function deleteAssets(ids: number[]) {
  const url = new URL(baseUrl)
  url.searchParams.append('ids', ids.join(','))
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      credentials: 'include'
    })
    if (response.ok) {
      return { ok: true as const }
    }
    const json = await response.json()
    const error = new ResponseError(response.status, json.error)
    return { ok: false as const, error }
  } catch (e) {
    console.log(e)
    const error = new ResponseError(500, 'the server encountered an error')
    return { ok: false as const, error }
  }
}
