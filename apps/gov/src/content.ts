import { getCollection, getEntry } from 'astro:content'

export const allPages = await getCollection('site')
export const allEvents = await getEntry('events', 'events')
export const allBooks = await getEntry('library', 'library')
export const allHolocaustDocuments = await getEntry(
  'holocaust-documents',
  'documents'
)
