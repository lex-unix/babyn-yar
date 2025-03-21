import { browser } from '$app/environment'
import { ResponseError } from '$lib/response-error'
import { captureException, withScope } from '@sentry/sveltekit'
import { MutationCache, QueryCache, QueryClient } from '@tanstack/svelte-query'

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      withScope(scope => {
        scope.setContext('mutation', {
          mutationId: mutation.mutationId
        })
        if (error instanceof ResponseError) {
          scope.setFingerprint([
            error.method,
            error.pathname,
            String(error.status)
          ])
        }
        captureException(error)
      })
    }
  }),
  queryCache: new QueryCache({
    onError: (error, query) => {
      withScope(scope => {
        scope.setContext('query', { queryHash: query.queryHash })
        if (error instanceof ResponseError) {
          scope.setFingerprint([
            error.method,
            error.pathname,
            String(error.status)
          ])
        }
        captureException(error)
      })
    }
  }),
  defaultOptions: {
    queries: {
      enabled: browser
    }
  }
})
