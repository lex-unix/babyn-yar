import { useQueryState, parseAsJson } from 'nuqs-svelte'
import { AssetFilters } from './assets/schema'
import * as v from 'valibot'
import { DEFAULT_SORT_OPTION } from './select-options'

export function useAssetFilters(defaults: AssetFilters = {}) {
  return useQueryState(
    'af',
    parseAsJson(value => v.parse(AssetFilters, value)).withDefault({
      sort: DEFAULT_SORT_OPTION,
      ...defaults
    })
  )
}
