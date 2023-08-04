import { getCollection, getEntry } from 'astro:content'

export const allPages = await getCollection('site')
export const allEvents = await getEntry('data', 'events')
