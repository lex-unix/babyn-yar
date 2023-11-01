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
    RecordActionBar
  } from '$components'
  import { File, Plus, History, User } from 'lucide-svelte'
  import { formatDate } from '$lib'
  import type { Event } from '$lib/types'
  import { onMount } from 'svelte'
  import { fetchEvents, deleteEvents } from '$lib'
  import { addToast } from '$components/Toaster.svelte'

  let events: Event[] = []
  let selected: number[] = []
  let alertDialog: DeleteAlertDialog

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

  async function deleteSelected() {
    const ok = await deleteEvents(selected)
    if (!ok) {
      addToast({
        data: {
          title: 'Щось пішло не так',
          description: 'Спробуйте ще раз',
          color: 'bg-emerald-500'
        }
      })
      return
    }
    events = events.filter(e => !selected.includes(e.id))
    selected = []
    alertDialog.closeAlertDialog()
    addToast({
      data: {
        title: 'Операція успішна',
        description: 'Елементи було видалено',
        color: 'bg-emerald-500'
      }
    })
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
  <RecordActionBar
    bind:selected
    on:delete={() => alertDialog.openAlertDialog()}
  />
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
          <TableData>
            <a href={`/content/events/${event.id}`}>{event.title}</a>
          </TableData>
          <TableData>{formatDate(event.updatedAt)}</TableData>
          <TableData>{event.user.fullName}</TableData>
        </TableRow>
      {/each}
    </tbody>
  </Table>
</Container>

<DeleteAlertDialog bind:this={alertDialog} on:confirm={deleteSelected} />
