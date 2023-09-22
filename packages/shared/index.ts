export { data as victimsData } from './victims'
export const EMAIL = 'babinyar@ukr.net'

export const stripLangFromSlug = (slug: string) =>
  slug.split('/').slice(1).join('/')

export const getLangFromSlug = (slug: string) => slug.split('/')[0]

// helper function to get types from `Object.keys()`
export const objectKeys = <T extends Record<string, any>>(
  obj: T
): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[]
}

// merge existing searchParams with new ones
export function addSearchParams(url: URL, params: Record<string, string> = {}) {
  let searchParams = url.searchParams

  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, value)
  }

  let newUrl = new URL(`${url.origin}${url.pathname}`)
  newUrl.search = searchParams.toString()
  return newUrl
}

// get searchParams where keys will be typed
export function getParams<K extends string>(
  url: URL,
  ...keys: K[]
): Record<K, string | null> {
  return keys.reduce((params, key) => {
    params[key] = url.searchParams.get(key)
    return params
  }, {} as Record<K, string | null>)
}
