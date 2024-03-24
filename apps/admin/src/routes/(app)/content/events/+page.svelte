<script lang="ts">
  import {
    Table,
    TableData,
    TableHeader,
    TableRow,
    DeleteAlertDialog,
    Container,
    PageHeader,
    LinkButton,
    RecordActionBar,
    TableSkeleton,
    SearchBar,
    Pagination,
    EventSortMenu
  } from '$components'
  import { File, Plus, History, User } from 'lucide-svelte'
  import { formatDate, trimText } from '$lib'
  import type { Event, Metadata } from '$lib/types'
  import { onMount } from 'svelte'
  import { deleteEvents, fetchEventsWrapper } from '$lib'
  import { addToast } from '$components/Toaster.svelte'

  let isLoading = false
  let events: Event[] = []
  let metadata: Metadata
  let selected: number[] = []
  let alertDialog: DeleteAlertDialog

  const fetchEvents = fetchEventsWrapper()

  onMount(async () => {
    isLoading = true
    const response = await fetchEvents()
    if (response.ok) {
      events = response.data.events
      metadata = response.data.metadata
    }
    isLoading = false
  })

  async function search(e: CustomEvent<{ search: string }>) {
    const res = await fetchEvents(1, { title: e.detail.search })
    if (res.ok) {
      events = res.data.events
      metadata = res.data.metadata
    }
  }

  async function sort(e: CustomEvent<string>) {
    const res = await fetchEvents(1, { sort: e.detail })
    if (res.ok) {
      events = res.data.events
      metadata = res.data.metadata
    }
  }

  function toggleSelect(id: number) {
    if (selected.includes(id)) {
      selected = selected.filter(e => e !== id)
    } else {
      selected = [...selected, id]
    }
  }

  function toggleSelectAll() {
    if (selected.length === events.length) {
      selected = []
    } else {
      selected = events.map(e => e.id)
    }
  }

  async function deleteSelected() {
    const ok = await deleteEvents(selected)
    if (!ok) {
      addToast({
        data: {
          title: 'Щось пішло не так',
          description: 'Спробуйте ще раз',
          variant: 'error'
        }
      })
      return
    }
    selected = []
    alertDialog.dismiss()
    addToast({
      data: {
        title: 'Операція успішна',
        description: 'Елементи було видалено',
        variant: 'success'
      }
    })
    const res = await fetchEvents()
    if (res.ok) {
      events = res.data.events
      metadata = res.data.metadata
    }
  }

  async function selectPage(e: CustomEvent<{ page: number }>) {
    const { page } = e.detail
    const response = await fetchEvents(page)
    if (response.ok) {
      events = response.data.events
      metadata = response.data.metadata
    }
  }
</script>

<PageHeader>
  <svelte:fragment slot="heading">Події</svelte:fragment>
  <LinkButton slot="right-items" href="/content/events/create">
    <Plus slot="icon" size={16} />
    Cтворити
  </LinkButton>
</PageHeader>

<Container title="Події">
  <div class="mb-5">
    <SearchBar on:search={search}>
      <EventSortMenu slot="filters" on:select={sort} />
    </SearchBar>
  </div>
  <RecordActionBar bind:selected on:delete={() => alertDialog.show()} />
  {#if events.length === 0 || isLoading}
    <TableSkeleton />
  {:else}
    <Table>
      <thead>
        <tr>
          <TableHeader>
            <input
              type="checkbox"
              checked={selected.length === events.length && selected.length > 0}
              on:input={toggleSelectAll}
            />
          </TableHeader>
          <TableHeader>
            <div class="inline-flex items-center gap-2">
              <File size={16} />
              <span>Сторінка</span>
            </div>
          </TableHeader>
          <TableHeader>
            <div class="flex items-center gap-2">
              <History size={16} />
              <span>Остання зміна</span>
            </div>
          </TableHeader>
          <TableHeader>
            <div class="inline-flex items-center gap-2">
              <User size={16} />
              <span>Автор</span>
            </div>
          </TableHeader>
        </tr>
      </thead>
      <tbody>
        {#each events as event}
          <TableRow>
            <TableData>
              <input
                type="checkbox"
                on:input={() => toggleSelect(event.id)}
                checked={selected.includes(event.id)}
              />
            </TableData>
            <TableData class="w-full">
              <a href={`/content/events/${event.id}`} class="block w-full">
                {trimText(event.title)}
              </a>
            </TableData>
            <TableData>{formatDate(event.updatedAt)}</TableData>
            <TableData>{event.user.fullName}</TableData>
          </TableRow>
        {/each}
      </tbody>
      <svelte:fragment slot="pagination">
        {#if metadata}
          <Pagination
            currentPage={metadata.currentPage}
            lastPage={metadata.lastPage}
            on:select={selectPage}
          />
        {/if}
      </svelte:fragment>
    </Table>
  {/if}
</Container>

<DeleteAlertDialog bind:this={alertDialog} on:confirm={deleteSelected} />
