<script lang="ts">
  import { Table, TableData, TableHeader, TableRow } from '$components'
  import { File, Plus, History, User, Trash } from 'lucide-svelte'
  import { formatDate } from '$lib'
  import type { Event } from '$lib/types'
  import { onMount } from 'svelte'
  import { PUBLIC_API_URL } from '$env/static/public'
  import { fetchEvents } from '$lib'

  let events: Event[] = []
  let selected: number[] = []

  onMount(async () => {
    const json = await fetchEvents()
    events = json.events
  })

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

  function clear() {
    selected = []
  }

  async function deleteSelected() {
    const url = new URL(PUBLIC_API_URL + '/events')
    url.searchParams.append('ids', selected.join(','))
    const response = await fetch(url, {
      method: 'DELETE',
      credentials: 'include'
    })
    if (response.ok) {
      events = events.filter(e => selected.includes(e.id))
      selected = []
    }
  }
</script>

<svelte:head>
  <title>Події</title>
</svelte:head>

<div class="flex items-center justify-between">
  <h1 class="text-2xl font-semibold">Події</h1>
  <a
    href="/content/events/create"
    class="flex items-center gap-3 rounded-md border border-sky-700/10 bg-teal-500 px-4 py-2 text-sm font-medium text-white"
  >
    <Plus size={16} />
    <span> Cтворити </span>
  </a>
</div>

{#if selected.length > 0}
  <div class="-mb-4 mt-6">
    <div
      class="w-full rounded-md bg-gray-800 text-sm font-normal text-gray-100"
    >
      <div class="px-3 py-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <p>Обрано {selected.length}</p>
            <button
              on:click={clear}
              class="rounded-md px-3 py-2 hover:bg-white/10"
            >
              Очистити
            </button>
          </div>
          <div class="flex items-center justify-center gap-4">
            <button
              on:click={deleteSelected}
              class="inline-flex items-center justify-center rounded-md p-2 hover:bg-white/20"
            >
              <Trash size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<div class="pt-10">
  <Table>
    <thead>
      <tr>
        <TableHeader>
          <input
            type="checkbox"
            checked={selected.length > 0}
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
          <TableData>
            <a href={`/content/events/${event.id}`}>{event.title}</a>
          </TableData>
          <TableData>{formatDate(event.updatedAt)}</TableData>
          <TableData>{event.user.fullName}</TableData>
        </TableRow>
      {/each}
    </tbody>
  </Table>
</div>
