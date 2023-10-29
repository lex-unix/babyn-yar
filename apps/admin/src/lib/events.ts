import type { Event, EventErrorResponse, Metadata } from './types'
import { PUBLIC_API_URL } from '$env/static/public'

const baseUrl = PUBLIC_API_URL + '/events'

export async function fetchEvent(id: string) {
  const res = await fetch(`${baseUrl}/${id}`)
  const { event } = (await res.json()) as { event: Event }
  event.content = JSON.parse(event.content as unknown as string)
  return event
}

export async function createEvent(body: string) {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      body,
      credentials: 'include'
    })
    if (!response.ok) {
      const json = await response.json()
      if (response.status === 442) {
        const errors: EventErrorResponse = json.error
        return { ok: false as const, errors }
      } else {
        return { ok: false as const }
      }
    }
    return { ok: true as const }
  } catch (e) {
    console.log(e)
    return { ok: false as const }
  }
}

export async function updateEvent(id: string, body: string) {
  try {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      body,
      credentials: 'include'
    })
    if (!response.ok) {
      const json = await response.json()
      if (response.status === 442) {
        const errors: EventErrorResponse = json.error
        return { ok: false as const, errors }
      } else {
        return { ok: false as const }
      }
    }
    return { ok: true as const }
  } catch (e) {
    console.log(e)
    return { ok: false as const }
  }
}

type EventResponse = {
  events: Event[]
  metadata: Metadata
}

export async function fetchEvents(page: number = 1) {
  const url = new URL(baseUrl)
  url.searchParams.set('page', `${page}`)
  const response = await fetch(url)
  const json = await response.json()

  return json as EventResponse
}

export async function deleteEvents(ids: number[]) {
  const url = new URL(baseUrl)
  url.searchParams.append('ids', ids.join(','))
  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include'
  })
  return response.ok
}
