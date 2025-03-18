import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import { derived, get } from 'svelte/store'

export const urlFilters = derived(page, $page => {
  const params = new URLSearchParams($page.url.search)
  params.sort()
  return params.toString()
})

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

export function removeUrlParams(...params: string[]) {
  const nextUrl = get(page).url
  params.forEach(param => {
    if (nextUrl.searchParams.has(param)) {
      nextUrl.searchParams.delete(param)
    }
  })
  return nextUrl.href
}

export function serializeUrlParams(
  filters: Record<string, string | number>
): string {
  return Object.entries(filters)
    .filter(([_, value]) => value && value.toString().length > 0)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([param, value]) => `${param}=${encodeURIComponent(value)}`)
    .join('&')
}
