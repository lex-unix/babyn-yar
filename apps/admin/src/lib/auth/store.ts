import type { User } from '$lib/users/schema'
import { derived, writable } from 'svelte/store'

export const currentUser = writable<User | null>(null)

export const isAdmin = derived(currentUser, $currentUser =>
  $currentUser ? $currentUser.permissions.includes('admin') : false
)
