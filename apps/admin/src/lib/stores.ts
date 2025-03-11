import { derived, writable } from 'svelte/store'
import type { User } from './types'
import { page } from '$app/stores'

export const user = writable<User | null>(null)

export const admin = derived(user, $user =>
  $user ? $user.permissions.includes('admin') : false
)

export const sidebarOpen = writable(false)

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
