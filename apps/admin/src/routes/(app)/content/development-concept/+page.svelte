<script lang="ts">
  import { ContentPage, LinkButton, PageHeader } from '$components'
  import type { ContentData, Metadata } from '$lib/types'
  import { onMount } from 'svelte'
  import { getDevConcepts, deleteDevConcepts } from '$lib/api-utils'
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
    const response = await getDevConcepts(params)
    if (!response.ok) {
      addToast(fetchErrorMsg)
      return
    }
    data = response.data.concepts.map(e => ({
      id: e.id,
      title: e.title,
      author: e.user.fullName,
      lastChange: e.updatedAt
    }))
    metadata = response.data.metadata
  }

  async function _delete(e: CustomEvent<{ selected: number[] }>) {
    const { ok } = await deleteDevConcepts(e.detail.selected)
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
  <svelte:fragment slot="heading">Концепція розвитку</svelte:fragment>
  <LinkButton slot="right-items" href="/content/development-concept/create">
    <Plus slot="icon" size={16} />
    Cтворити
  </LinkButton>
</PageHeader>

<ContentPage
  {metadata}
  {data}
  {isLoading}
  title="Концепція розвитку"
  entryHref="/content/development-concept"
  on:filter={filter}
  on:delete={_delete}
/>
