import { getLangFromSlug, stripLangFromSlug } from '@/util'
import { test, expect } from 'vitest'

const slug = 'uk/visit/events'

test('shoud remove lang from the slug', () => {
  const stripped = stripLangFromSlug(slug)
  expect(stripped).toBe('visit/events')
})

test('should return the lang from the slug', () => {
  const lang = getLangFromSlug(slug)
  expect(lang).toBe('uk')
})
