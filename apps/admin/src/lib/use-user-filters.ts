import { parseAsJson, useQueryState } from 'nuqs-svelte'
import { UserFilters } from './users/schema'
import * as v from 'valibot'

export function useUserFilters(defaults: UserFilters = {}) {
  return useQueryState(
    'user_filters',
    parseAsJson(value => v.parse(UserFilters, value)).withDefault(defaults)
  )
}
