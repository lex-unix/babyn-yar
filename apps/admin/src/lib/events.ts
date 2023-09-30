import { } from '$app/stores'
import type { Event } from './types'

export async function fetchEvent(id: string) {
  const res = await fetch('http://localhost:8000/v1/events/' + id)
  const { event } = (await res.json()) as { event: Event }
  event.content = JSON.parse(event.content as unknown as string)
  return event
}
