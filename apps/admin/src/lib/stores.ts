import { derived, writable } from 'svelte/store'
import { page } from '$app/stores'

export const sidebarOpen = writable(false)

export const isMobileDrawerOpen = writable(false)

export const filters = derived(page, $page => ({
  page: $page.url.searchParams.has('page')
    ? parseInt($page.url.searchParams.get('page') as string)
    : 1,
  pageSize: $page.url.searchParams.has('pageSize')
    ? parseInt($page.url.searchParams.get('pageSize') as string)
    : 10,
  search: $page.url.searchParams.get('search') || '',
  sort: $page.url.searchParams.get('sort') || ''
}))

export const scrollContainer = writable<HTMLElement | undefined>(undefined)
