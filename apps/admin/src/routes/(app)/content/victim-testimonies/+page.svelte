<script lang="ts">
  import { ContentPage, LinkButton, PageHeader } from '$components'
  import type { ContentData, Metadata } from '$lib/types'
  import { onMount } from 'svelte'
  import { getTestimonies, deleteTestimonies } from '$lib/api-utils'
  import { addToast } from '$components/Toaster.svelte'
  import { deleteErrorMsg, fetchErrorMsg } from '$lib/toast-messages'
  import { page } from '$app/stores'
  import { Plus } from 'lucide-svelte'

  let data: ContentData[] = []
  let metadata: Metadata
  let isLoading = false

  onMount(async () => {
    isLoading = true
    const params = Object.fromEntries($page.url.searchParams)
    await load(replaceSearch(params))
    isLoading = false
  })

  function replaceSearch(params: Record<string, string>) {
    if (params.search) {
      params.title = params.search
    }
    return params
  }

  async function load(params: Record<string, string> = {}) {
    const response = await getTestimonies(params)
    if (!response.ok) {
      addToast(fetchErrorMsg)
      return
    }
    data = response.data.testimonies.map(t => ({
      id: t.id,
      title: t.title,
      author: t.user.fullName,
      lastChange: t.updatedAt
    }))
    metadata = response.data.metadata
  }

  async function _delete(e: CustomEvent<{ selected: number[] }>) {
    const { ok } = await deleteTestimonies(e.detail.selected)
    if (!ok) {
      addToast(deleteErrorMsg)
      return
    }
    const params = Object.fromEntries($page.url.searchParams)
    await load(replaceSearch(params))
  }

  async function filter(e: CustomEvent<Record<string, string>>) {
    const filters = replaceSearch(e.detail)
    await load({ ...filters })
  }
</script>

<PageHeader>
  <svelte:fragment slot="heading">Свідчення очевидців трагедії</svelte:fragment>
  <LinkButton slot="right-items" href="/content/victim-testimonies/create">
    <Plus slot="icon" size={16} />
    Cтворити
  </LinkButton>
</PageHeader>

<ContentPage
  {metadata}
  {data}
  {isLoading}
  title="ЗМІ про заповідник"
  entryHref="/content/victim-testimonies"
  on:filter={filter}
  on:delete={_delete}
/>
