/// <reference types="vitest" />
import { getViteConfig } from 'astro/config'

export default getViteConfig({
  test: {
    coverage: {
      reporter: 'html',
      reportsDirectory: './vitest-coverage'
    }
  }
})
