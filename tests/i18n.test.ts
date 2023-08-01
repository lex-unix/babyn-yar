import { getLangFromUrl } from '@/i18n/utils'
import { test, expect } from 'vitest'

const baseUrl = 'http://localhost:3000'

test('returns correct language', () => {
  const url = new URL('/uk/events/visit', baseUrl)
  const lang = getLangFromUrl(url)
  expect(lang).toBe('uk')
})

test('returns default language if parsed language in not defined', () => {
  const url = new URL('/fr/events/visit', baseUrl)
  const lang = getLangFromUrl(url)
  expect(lang).toBe('uk')
})
