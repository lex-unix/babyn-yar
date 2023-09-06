export { data as victimsData } from './victims'
export const EMAIL = 'babinyar@ukr.net'

export const stripLangFromSlug = (slug: string) =>
  slug.split('/').slice(1).join('/')

export const getLangFromSlug = (slug: string) => slug.split('/')[0]

/*
  helper function to get types from `Object.keys()`
*/
export const objectKeys = <T extends Record<string, any>>(
  obj: T
): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[]
}
