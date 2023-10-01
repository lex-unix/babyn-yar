import type { Asset } from './types'

type Filters = {
  filename?: string
  sort?: string
}

export async function fetchAssets(filters?: Filters) {
  let searchParams: URLSearchParams | string = ''
  let baseUrl = 'http://localhost:8000/v1/assets'
  if (filters) {
    searchParams = new URLSearchParams(filters).toString()
    baseUrl += '?' + searchParams
  }
  const res = await fetch(baseUrl)
  const json = await res.json()
  return json.assets as Asset[]
}
