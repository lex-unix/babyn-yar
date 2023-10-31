<script lang="ts">
  import {
    DeleteAlertDialog,
    Table,
    TableData,
    TableHeader,
    TableRow,
    ErrorMessage
  } from '$components'
  import { File, Plus, History, User, Trash } from 'lucide-svelte'
  import { formatDate } from '$lib'
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

  function clear() {
    selected = []
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

<div class="flex items-center justify-between">
  <h1 class="text-2xl font-semibold">Бібліотека</h1>
  <a
    href="/content/library/create"
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
              on:click={() => alertDialog.openAlertDialog()}
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

{#if isError}
  <ErrorMessage>
    При завантажені даних сталася помилка. Спробуйте ще раз.
  </ErrorMessage>
{:else}
  <div class="pt-10">
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
          {@const title =
            book.title.length < 50
              ? book.title
              : book.title.slice(0, 50) + '...'}
          <TableRow>
            <TableData>
              <input
                type="checkbox"
                on:input={() => toggleSelect(book.id)}
                checked={selected.includes(book.id)}
              />
            </TableData>
            <TableData>
              <a href={`/content/library/${book.id}`}>{title}</a>
            </TableData>
            <TableData>{formatDate(book.updatedAt)}</TableData>
            <TableData>{book.user.fullName}</TableData>
          </TableRow>
        {/each}
      </tbody>
    </Table>
  </div>
{/if}

<DeleteAlertDialog bind:this={alertDialog} on:confirm={deleteSelected} />
