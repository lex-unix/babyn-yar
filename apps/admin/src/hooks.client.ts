import { currentUser } from '$lib/auth/store'
import * as Sentry from '@sentry/sveltekit'
import type { HandleClientError } from '@sveltejs/kit'

Sentry.init({
  dsn: 'https://2fa0f5212da27f8a385d59ee059814bc@o4507650143748096.ingest.us.sentry.io/4509004455149568',
  environment: import.meta.env.PROD ? 'production' : 'development',
  tracesSampleRate: 0.1,
  integrations: [Sentry.replayIntegration()],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 0.2
})

currentUser.subscribe(user => {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email
    })
  } else {
    Sentry.setUser(null)
  }
})

const errorHandler: HandleClientError = ({ event, error }) => {
  console.error('An error occurred on the client side: ', error, event)
}

export const handleError = Sentry.handleErrorWithSentry(errorHandler)
