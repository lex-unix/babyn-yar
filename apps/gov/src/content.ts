import { getCollection, render } from 'astro:content'

export { render }
export const getAllPages = async () => await getCollection('site')
