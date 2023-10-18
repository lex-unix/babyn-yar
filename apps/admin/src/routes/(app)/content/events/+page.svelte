<script lang="ts">
  import { Table, TableData, TableHeader, TableRow } from '$components'
  import { File, Plus, History, User } from 'lucide-svelte'
  import { formatDate } from '$lib'
  import type { Event, Metadata } from '$lib/types'

  type EventResponse = {
    events: Event[]
    metadata: Metadata
  }

  let promise: Promise<EventResponse> = fetch(
    'http://localhost:8000/v1/events'
  ).then(res => res.json())
</script>

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

<div class="pt-10">
  <Table>
    <thead>
      <tr>
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
      {#await promise}
        <p>Завантаження...</p>
      {:then { events }}
        {#each events as event}
          <TableRow>
            <TableData>
              <a href={`/content/events/${event.id}`}>{event.title}</a>
            </TableData>
            <TableData>{formatDate(event.updatedAt)}</TableData>
            <TableData>{event.user.fullName}</TableData>
          </TableRow>
        {/each}
      {/await}
    </tbody>
  </Table>
</div>
