import type { Metadata, TestimonyErrorResponse, VictimTestimony } from './types'
import { PUBLIC_API_URL } from '$env/static/public'

const baseUrl = PUBLIC_API_URL + '/victim-testimonies'

export async function createTestimony(body: string) {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      body,
      credentials: 'include'
    })
    if (!response.ok) {
      const json = await response.json()
      if (response.status === 442) {
        const errors: TestimonyErrorResponse = json.error
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

type TestimonyResponse = {
  testimonies: VictimTestimony[]
  metadata: Metadata
}

export async function fetchTestimonies(page: number = 1) {
  const url = new URL(baseUrl)
  url.searchParams.set('page', `${page}`)
  const response = await fetch(url)
  const json = await response.json()

  return json as TestimonyResponse
}
