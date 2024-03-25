<script lang="ts">
  import {
    DeleteAlertDialog,
    Table,
    TableData,
    TableHeader,
    TableRow,
    PageHeader,
    Container,
    LinkButton,
    RecordActionBar,
    TableSkeleton,
    Pagination
  } from '$components'
  import { File, Plus, History, User } from 'lucide-svelte'
  import { formatDate, trimText } from '$lib'
  import type { Metadata, VictimTestimony } from '$lib/types'
  import { onMount } from 'svelte'
  import { fetchBooksWrapper, deleteBooks } from '$lib/books'
  import { addToast } from '$components/Toaster.svelte'
  import {
    deleteErrorMsg,
    deleteSuccessMsg,
    fetchErrorMsg
  } from '$lib/toast-messages'

  let books: VictimTestimony[] = []
  let metadata: Metadata
  let selected: number[] = []
  let alertDialog: DeleteAlertDialog
  let isLoading = false

  const fetchBooks = fetchBooksWrapper()

  onMount(async () => {
    isLoading = true
    await load()
    isLoading = false
  })

  async function load(pageNum = 1) {
    const response = await fetchBooks(pageNum)
    if (!response.ok) {
      addToast(fetchErrorMsg)
      return
    }
    books = response.data.books
    metadata = response.data.metadata
  }

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
      addToast(deleteErrorMsg)
      return
    }

    selected = []
    alertDialog.dismiss()
    addToast(deleteSuccessMsg)

    await load()
  }

  async function selectPage(e: CustomEvent<{ page: number }>) {
    const { page } = e.detail
    await load(page)
  }
</script>

<PageHeader>
  <svelte:fragment slot="heading">Бібліотека</svelte:fragment>
  <LinkButton slot="right-items" href="/content/library/create">
    <Plus slot="icon" size={16} />
    Cтворити
  </LinkButton>
</PageHeader>

<Container title="Бібліотека">
  <RecordActionBar bind:selected on:delete={() => alertDialog.show()} />
  {#if books.length === 0 || isLoading}
    <TableSkeleton />
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
            <TableData class="w-full">
              <a href={`/content/library/${book.id}`}>{trimText(book.title)}</a>
            </TableData>
            <TableData>{formatDate(book.updatedAt)}</TableData>
            <TableData>{book.user.fullName}</TableData>
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
