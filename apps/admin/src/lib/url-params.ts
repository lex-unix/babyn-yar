import { browser } from '$app/environment'
import { goto } from '$app/navigation'

export function updateFilter<T extends Record<string, string | number>>(
  key: keyof T,
  value: string | number
) {
  if (!browser) return
  const url = new URL(window.location.href)

  if (!value) {
    url.searchParams.delete(key.toString())
  } else {
    url.searchParams.set(key.toString(), value.toString())
  }
  goto(url.toString(), { keepFocus: true, replaceState: true })
}

export function updateFilters<T extends Record<string, string | number>>(
  newFilters: Partial<T>
) {
  const url = new URL(window.location.href)

  for (const [key, value] of Object.entries(newFilters)) {
    if (!value) {
      url.searchParams.delete(key)
    } else {
      url.searchParams.set(key, value.toString())
    }
  }

  goto(url.toString(), { keepFocus: true, replaceState: true })
}

export function urlWithSearchParams(
  url: string,
  params: Record<string, string | number>
) {
  const finalUrl = new URL(url)
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      finalUrl.searchParams.set(key, `${value}`)
    }
  }
  return finalUrl
}
