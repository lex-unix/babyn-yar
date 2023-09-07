import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'

import sitemap from '@astrojs/sitemap'

const isProd = import.meta.env.PROD
console.log(isProd)

// https://astro.build/config
export default defineConfig({
  site: 'https://babynyar.gov.ua',
  publicDir: isProd ? './public' : '../../public',
  integrations: [tailwind(), react(), mdx(), sitemap()]
})
