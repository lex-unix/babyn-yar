import { useQueryState, parseAsJson } from 'nuqs-svelte'
import * as v from 'valibot'
import { ContentFilters } from './content/schema'
import { DEFAULT_CONTENT_SORT_OPTION } from './select-options'

export function useContentFilters(defaults: ContentFilters = {}) {
  return useQueryState(
    'cf',
    parseAsJson(value => v.parse(ContentFilters, value)).withDefault({
      title: '',
      page: 1,
      sort: DEFAULT_CONTENT_SORT_OPTION,
      page_size: 50,
      ...defaults
    })
  )
}
