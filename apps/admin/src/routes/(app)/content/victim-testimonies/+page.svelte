<script lang="ts">
  import {
    DeleteAlertDialog,
    Table,
    TableData,
    TableHeader,
    TableRow,
    LinkButton,
    PageHeader,
    Container,
    RecordActionBar,
    TableSkeleton
  } from '$components'
  import { File, Plus, History, User } from 'lucide-svelte'
  import { formatDate, trimText } from '$lib'
  import type { VictimTestimony } from '$lib/types'
  import { onMount } from 'svelte'
  import { fetchTestimonies, deleteTestimonies } from '$lib'
  import { addToast } from '$components/Toaster.svelte'

  let testimonies: VictimTestimony[] = []
  let selected: number[] = []
  let alertDialog: DeleteAlertDialog
  let isLoading = false

  onMount(async () => {
    isLoading = true
    const json = await fetchTestimonies()
    testimonies = json.testimonies
    isLoading = false
  })

  function toggleSelect(id: number) {
    if (selected.includes(id)) {
      selected = selected.filter(t => t !== id)
    } else {
      selected = [...selected, id]
    }
  }

  function toggleSelectAll() {
    if (selected.length === testimonies.length) {
      selected = []
    } else {
      selected = testimonies.map(t => t.id)
    }
  }

  async function deleteSelected() {
    const ok = await deleteTestimonies(selected)
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
    testimonies = testimonies.filter(t => !selected.includes(t.id))
    selected = []
    alertDialog.dismiss()
    addToast({
      data: {
        title: 'Операція успішна',
        description: 'Елементи було видалено',
        variant: 'success'
      }
    })
  }
</script>

<PageHeader>
  <svelte:fragment slot="heading">Свідчення очевидців трагедії</svelte:fragment>
  <LinkButton slot="right-items" href="/content/victim-testimonies/create">
    <Plus slot="icon" size={16} />
    Cтворити
  </LinkButton>
</PageHeader>

<Container title="Свідчення очевидців трагедії">
  <RecordActionBar bind:selected on:delete={() => alertDialog.show()} />
  {#if testimonies.length === 0 || isLoading}
    <TableSkeleton />
  {:else}
    <Table>
      <thead>
        <tr>
          <TableHeader>
            <input
              type="checkbox"
              checked={selected.length === testimonies.length &&
                selected.length > 0}
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
        {#each testimonies as testimony}
          <TableRow>
            <TableData>
              <input
                type="checkbox"
                on:input={() => toggleSelect(testimony.id)}
                checked={selected.includes(testimony.id)}
              />
            </TableData>
            <TableData>
              <a href={`/content/victim-testimonies/${testimony.id}`}
                >{trimText(testimony.title)}</a
              >
            </TableData>
            <TableData>{formatDate(testimony.updatedAt)}</TableData>
            <TableData>{testimony.user.fullName}</TableData>
          </TableRow>
        {/each}
      </tbody>
    </Table>
  {/if}
</Container>
<DeleteAlertDialog bind:this={alertDialog} on:confirm={deleteSelected} />
