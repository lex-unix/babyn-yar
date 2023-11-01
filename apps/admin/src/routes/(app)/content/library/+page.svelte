<script lang="ts">
  import {
    DeleteAlertDialog,
    Table,
    TableData,
    TableHeader,
    TableRow,
    ErrorMessage,
    PageHeader,
    Container,
    LinkButton,
    RecordActionBar
  } from '$components'
  import { File, Plus, History, User } from 'lucide-svelte'
  import { formatDate, trimText } from '$lib'
  import type { VictimTestimony } from '$lib/types'
  import { onMount } from 'svelte'
  import { fetchBooks, deleteBooks } from '$lib'
  import { addToast } from '$components/Toaster.svelte'

  let books: VictimTestimony[] = []
  let selected: number[] = []
  let alertDialog: DeleteAlertDialog
  let isError = false

  onMount(async () => {
    const res = await fetchBooks()
    isError = !res.ok
    if (res.ok) {
      books = res.data.books
    }
  })

  function toggleSelect(id: number) {
    if (selected.includes(id)) {
      selected = selected.filter(t => t !== id)
    } else {
      selected = [...selected, id]
    }
  }

  function toggleSelectAll() {
    if (selected.length === books.length) {
      selected = []
    } else {
      selected = books.map(t => t.id)
    }
  }

  async function deleteSelected() {
    const { ok } = await deleteBooks(selected)
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
    books = books.filter(t => !selected.includes(t.id))
    selected = []
    alertDialog.closeAlertDialog()
    addToast({
      data: {
        title: 'Операція успішна',
        description: 'Записи було видалено',
        color: 'bg-emerald-500'
      }
    })
  }
</script>

<svelte:head>
  <title>Події</title>
</svelte:head>

<PageHeader>
  <svelte:fragment slot="heading">Бібліотека</svelte:fragment>
  <LinkButton slot="right-items" href="/content/library/create">
    <Plus slot="icon" size={16} />
    Cтворити
  </LinkButton>
</PageHeader>

<Container title="Події">
  <RecordActionBar
    bind:selected
    on:delete={() => alertDialog.openAlertDialog()}
  />

  {#if isError}
    <ErrorMessage>
      При завантажені даних сталася помилка. Спробуйте ще раз.
    </ErrorMessage>
  {:else}
    <Table>
      <thead>
        <tr>
          <TableHeader>
            <input
              type="checkbox"
              checked={selected.length === books.length && selected.length > 0}
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
        {#each books as book}
          <TableRow>
            <TableData>
              <input
                type="checkbox"
                on:input={() => toggleSelect(book.id)}
                checked={selected.includes(book.id)}
              />
            </TableData>
            <TableData>
              <a href={`/content/library/${book.id}`}>{trimText(book.title)}</a>
            </TableData>
            <TableData>{formatDate(book.updatedAt)}</TableData>
            <TableData>{book.user.fullName}</TableData>
          </TableRow>
        {/each}
      </tbody>
    </Table>
  {/if}
</Container>

<DeleteAlertDialog bind:this={alertDialog} on:confirm={deleteSelected} />
