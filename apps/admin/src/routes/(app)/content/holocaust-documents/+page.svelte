<script lang="ts">
  import { ContentPage, LinkButton, PageHeader } from '$components'
  import type { ContentData, Metadata } from '$lib/types'
  import { onMount } from 'svelte'
  import { getHolocaustDocs, deleteHolocaustDocs } from '$lib/api-utils'
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
    const response = await getHolocaustDocs(params)
    if (!response.ok) {
      addToast(fetchErrorMsg)
      return
    }
    data = response.data.documents.map(d => ({
      id: d.id,
      title: d.title,
      author: d.user.fullName,
      lastChange: d.updatedAt
    }))
    metadata = response.data.metadata
  }

  async function _delete(e: CustomEvent<{ selected: number[] }>) {
    const { ok } = await deleteHolocaustDocs(e.detail.selected)
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
  <svelte:fragment slot="heading">Документи Голокосту</svelte:fragment>
  <LinkButton slot="right-items" href="/content/holocaust-documents/create">
    <Plus slot="icon" size={16} />
    Cтворити
  </LinkButton>
</PageHeader>

<ContentPage
  {metadata}
  {data}
  {isLoading}
  title="ЗМІ про заповідник"
  entryHref="/content/holocaust-documents"
  on:filter={filter}
  on:delete={_delete}
/>
