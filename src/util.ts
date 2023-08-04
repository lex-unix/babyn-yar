import type { CollectionEntry } from 'astro:content'

export const stripLangFromSlug = (slug: CollectionEntry<'site'>['slug']) =>
  slug.split('/').slice(1).join('/')

export const getLangFromSlug = (slug: CollectionEntry<'site'>['slug']) =>
  slug.split('/')[0]

/*
  helper function to get types from `Object.keys()`
*/
export const objectKeys = <T extends Record<string, any>>(
  obj: T
): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[]
}
