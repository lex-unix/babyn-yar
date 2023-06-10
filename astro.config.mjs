import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'

import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  site: 'https://www.babynyar.org.ua',
  integrations: [
    tailwind(),
    react(),
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'ua',
        locales: {
          en: 'en-US',
          ua: 'uk-UA'
        }
      }
    })
  ]
})
