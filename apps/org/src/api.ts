import { ResponseError } from 'shared'
import type {
  Book,
  Event,
  HolocaustDocument,
  VictimTestimony,
  Metadata,
  MediaArticle
} from 'shared-types'

type PaginatedResponse = {
  metadata: Metadata
}

type PaginatedEvents = PaginatedResponse & {
  events: Event[]
}

type PaginatedBooks = PaginatedResponse & {
  books: Book[]
}

type PaginatedHolocaustDocuments = PaginatedResponse & {
  documents: HolocaustDocument[]
}

type PaginatedVictimTestimonies = PaginatedResponse & {
  testimonies: VictimTestimony[]
}

type PaginatedArticles = PaginatedResponse & {
  articles: MediaArticle[]
}

const apiURL = import.meta.env.API_URL

export async function fetchEvents(page: string = '1') {
  const url = new URL(apiURL + '/events')
  url.searchParams.set('page', page)
  url.searchParams.set('lang', 'en')
  try {
    const response = await fetch(url)
    const json = await response.json()
    if (response.ok) {
      return { ok: true as const, data: json as PaginatedEvents }
    }
    const error = new ResponseError(response.status, json.error)
    return { ok: false as const, error }
  } catch (e) {
    console.log(e)
    const error = new ResponseError(500, 'the server encountered an error')
    return { ok: false as const, error }
  }
}
export async function fetchEvent(id: string) {
  try {
    const res = await fetch(`${apiURL}/events/${id}`)
    if (!res.ok) {
      const json = await res.json()
      const error = new ResponseError(res.status, json.error)
      return { ok: false as const, error }
    }
    const { event } = (await res.json()) as { event: Event }
    event.content = JSON.parse(event.content as unknown as string)
    return { ok: true as const, event }
  } catch (e) {
    console.log(e)
    const error = new ResponseError(500, 'the server encountered an error')
    return { ok: false as const, error }
  }
}

export async function fetchBooks(page: string = '1') {
  const url = new URL(apiURL + '/books')
  url.searchParams.set('page', `${page}`)
  url.searchParams.set('lang', 'en')
  try {
    const response = await fetch(url)
    const json = await response.json()
    if (response.ok) {
      return { ok: true as const, data: json as PaginatedBooks }
    }
    const error = new ResponseError(response.status, json.error)
    return { ok: false as const, error }
  } catch (e) {
    console.log(e)
    const error = new ResponseError(500, 'the server encountered an error')
    return { ok: false as const, error }
  }
}

export async function fetchBook(id: string) {
  try {
    const res = await fetch(`${apiURL}/books/${id}`)
    if (!res.ok) {
      const json = await res.json()
      const error = new ResponseError(res.status, json.error)
      return { ok: false as const, error }
    }
    const { book } = (await res.json()) as { book: Book }
    book.content = JSON.parse(book.content as unknown as string)
    return { ok: true as const, book }
  } catch (e) {
    console.log(e)
    const error = new ResponseError(500, 'the server encountered an error')
    return { ok: false as const, error }
  }
}

export async function fetchHolocaustDocuments(page: string = '1') {
  const url = new URL(apiURL + '/holocaust-documents')
  url.searchParams.set('page', `${page}`)
  url.searchParams.set('lang', 'en')
  try {
    const response = await fetch(url)
    const json = await response.json()
    if (response.ok) {
      return { ok: true as const, data: json as PaginatedHolocaustDocuments }
    }
    const error = new ResponseError(response.status, json.error)
    return { ok: false as const, error }
  } catch (e) {
    console.log(e)
    const error = new ResponseError(500, 'the server encountered an error')
    return { ok: false as const, error }
  }
}

export async function fetchHolocaustDocument(id: string) {
  try {
    const res = await fetch(`${apiURL}/holocaust-documents/${id}`)
    if (!res.ok) {
      const json = await res.json()
      const error = new ResponseError(res.status, json.error)
      return { ok: false as const, error }
    }
    const { document } = (await res.json()) as { document: HolocaustDocument }
    document.content = JSON.parse(document.content as unknown as string)
    return { ok: true as const, document }
  } catch (e) {
    console.log(e)
    const error = new ResponseError(500, 'the server encountered an error')
    return { ok: false as const, error }
  }
}

export async function fetchVictimTestimonies(page: string = '1') {
  const url = new URL(apiURL + '/victim-testimonies')
  url.searchParams.set('page', `${page}`)
  url.searchParams.set('lang', 'en')
  try {
    const response = await fetch(url)
    const json = await response.json()
    if (response.ok) {
      return { ok: true as const, data: json as PaginatedVictimTestimonies }
    }
    const error = new ResponseError(response.status, json.error)
    return { ok: false as const, error }
  } catch (e) {
    console.log(e)
    const error = new ResponseError(500, 'the server encountered an error')
    return { ok: false as const, error }
  }
}

export async function fetchVictimTestimony(id: string) {
  try {
    const res = await fetch(`${apiURL}/victim-testimonies/${id}`)
    if (!res.ok) {
      const json = await res.json()
      const error = new ResponseError(res.status, json.error)
      return { ok: false as const, error }
    }
    const { testimony } = (await res.json()) as { testimony: VictimTestimony }
    testimony.content = JSON.parse(testimony.content as unknown as string)
    return { ok: true as const, testimony }
  } catch (e) {
    console.log(e)
    const error = new ResponseError(500, 'the server encountered an error')
    return { ok: false as const, error }
  }
}

export async function fetchArticles(page: string = '1') {
  const url = new URL(apiURL + '/media-articles')
  url.searchParams.set('page', page)
  url.searchParams.set('lang', 'en')
  url.searchParams.set('sort', '-occurred_on')
  try {
    const response = await fetch(url)
    const json = await response.json()
    if (response.ok) {
      return { ok: true as const, data: json as PaginatedArticles }
    }
    const error = new ResponseError(response.status, json.error)
    return { ok: false as const, error }
  } catch (e) {
    console.log(e)
    const error = new ResponseError(500, 'the server encountered an error')
    return { ok: false as const, error }
  }
}

export async function fetchArticle(id: string) {
  try {
    const res = await fetch(`${apiURL}/media-articles/${id}`)
    if (!res.ok) {
      const json = await res.json()
      const error = new ResponseError(res.status, json.error)
      return { ok: false as const, error }
    }
    const { article } = (await res.json()) as { article: MediaArticle }
    article.content = JSON.parse(article.content as unknown as string)
    return { ok: true as const, article }
  } catch (e) {
    console.log(e)
    const error = new ResponseError(500, 'the server encountered an error')
    return { ok: false as const, error }
  }
}
