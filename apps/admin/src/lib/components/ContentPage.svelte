<script lang="ts">
  import {
    DeleteAlertDialog,
    Table,
    TableData,
    TableHeader,
    TableRow,
    Container,
    RecordActionBar,
    TableSkeleton,
    Pagination,
    SearchBar,
    ContentSortMenu,
    EmptySearchMessage
  } from '$components'
  import { File, History, User } from 'lucide-svelte'
  import { formatDate } from '$lib/format-date'
  import { trimText } from '$lib/trim-text'
  import type { Metadata, ContentData } from '$lib/types'
  import { createEventDispatcher } from 'svelte'
  import { calculateNewPage } from '$lib/pagination'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'

  export let data: ContentData[] = []
  export let metadata: Metadata

  export let isLoading = true
  export let entryHref: string
  export let title: string

  let selected: number[] = []
  let alertDialog: DeleteAlertDialog

  const dispatch = createEventDispatcher()

  function mergeParams(newParams: Record<string, string | number>) {
    const oldParams = Object.fromEntries(
      new URLSearchParams($page.url.searchParams)
    )
    const stringifiedNewParams = Object.fromEntries(
      Object.entries(newParams).map(([key, value]) => [key, value.toString()])
    )
    return new URLSearchParams({ ...oldParams, ...stringifiedNewParams })
  }

  function dispatchAndUpdateParams(
    event: string,
    params: Record<string, string | number>
  ) {
    const mergedParams = mergeParams(params)
    dispatch(event, Object.fromEntries(mergedParams))
    goto(`?${mergedParams.toString()}`, { replaceState: true, keepFocus: true })
  }

  function toggleSelect(id: number) {
    if (selected.includes(id)) {
      selected = selected.filter(t => t !== id)
    } else {
      selected = [...selected, id]
    }
  }

  function toggleSelectAll() {
    if (selected.length === data.length) {
      selected = []
    } else {
      selected = data.map(t => t.id)
    }
  }

  function deleteSelected() {
    dispatch('delete', { selected: [...selected] })
    alertDialog.dismiss()
    selected = []
  }

  function search(e: CustomEvent<{ search: string }>) {
    dispatchAndUpdateParams('filter', { page: 1, search: e.detail.search })
  }

  function sort(e: CustomEvent<{ sortValue: string }>) {
    dispatchAndUpdateParams('filter', { page: 1, sort: e.detail.sortValue })
  }

  function selectPage(e: CustomEvent<{ page: number }>) {
    dispatchAndUpdateParams('filter', { page: e.detail.page })
  }

  function selectPageSize(e: CustomEvent<{ size: number }>) {
    const newPageSize = e.detail.size
    const { currentPage, pageSize: currentPageSize } = metadata
    if (newPageSize === currentPageSize) return
    const page = calculateNewPage(currentPage, currentPageSize, newPageSize)
    dispatchAndUpdateParams('filter', { page, page_size: newPageSize })
  }
</script>

<Container {title}>
  <div class="mb-5">
    <SearchBar on:search={search}>
      <ContentSortMenu slot="filters" on:select={sort} />
    </SearchBar>
  </div>
  <RecordActionBar bind:selected on:delete={() => alertDialog.show()} />
  {#if isLoading}
    <TableSkeleton />
  {:else if !isLoading && data.length === 0}
    <EmptySearchMessage />
  {:else}
    <Table>
      <thead>
        <tr>
          <TableHeader>
            <input
              type="checkbox"
              checked={selected.length === data.length && selected.length > 0}
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
        {#each data as entry}
          <TableRow>
            <TableData>
              <input
                type="checkbox"
                on:input={() => toggleSelect(entry.id)}
                checked={selected.includes(entry.id)}
              />
            </TableData>
            <TableData class="w-full">
              <a href={`${entryHref}/${entry.id}`}>{trimText(entry.title)}</a>
            </TableData>
            <TableData>{formatDate(entry.lastChange)}</TableData>
            <TableData>{entry.author}</TableData>
          </TableRow>
        {/each}
      </tbody>
      <svelte:fragment slot="pagination">
        {#if metadata}
          <Pagination
            currentPage={metadata.currentPage}
            lastPage={metadata.lastPage}
            on:select={selectPage}
            on:selectSize={selectPageSize}
          />
        {/if}
      </svelte:fragment>
    </Table>
  {/if}
</Container>

<DeleteAlertDialog bind:this={alertDialog} on:confirm={deleteSelected} />
