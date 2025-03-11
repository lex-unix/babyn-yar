import { PUBLIC_API_URL } from '$env/static/public'
import { fetcher } from '$lib/fetcher'
import type { Content } from '$lib/types'
import { createQuery, type CreateQueryOptions } from '@tanstack/svelte-query'
import type { ResponseError } from 'shared'
import { derived, type Readable } from 'svelte/store'

export function missingTranslationsQuery(contentType: Readable<string>) {
  return createQuery(
    derived(contentType, $contentType => {
      return {
        queryKey: ['missingTranslations', $contentType],
        queryFn: ({ queryKey }) => {
          return fetcher(
            PUBLIC_API_URL +
              `/content/translations/missing?content_type=${queryKey[1]}`
          )
        }
      } as CreateQueryOptions<{ missingTranslations: Content[] }, ResponseError>
    })
  )
}
