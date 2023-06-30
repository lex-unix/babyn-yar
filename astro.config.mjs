import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'

import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  site: 'https://babynyar.org.ua',
  integrations: [
    tailwind(),
    react(),
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'uk',
        locales: {
          en: 'en-US',
          uk: 'uk-UA'
        }
      }
    })
  ]
})
