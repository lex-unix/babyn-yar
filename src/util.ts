import type { CollectionEntry } from 'astro:content'

export const stripLangFromSlug = (slug: CollectionEntry<'site'>['slug']) =>
  slug.split('/').slice(1).join('/')

export const getLangFromSlug = (slug: CollectionEntry<'site'>['slug']) =>
  slug.split('/')[0]
