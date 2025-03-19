import tailwindcss from '@tailwindcss/vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { sentrySvelteKit } from '@sentry/sveltekit'

export default defineConfig({
  build: {
    sourcemap: true
  },
  plugins: [
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN
      }
    }),
    sveltekit(),
    tailwindcss()
  ]
})
