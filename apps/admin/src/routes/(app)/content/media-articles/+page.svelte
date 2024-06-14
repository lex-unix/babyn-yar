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
    ContentSortMenu,
    EmptySearchMessage
  } from '$components'
  import { File, Plus, History, User } from 'lucide-svelte'
  import { formatDate } from '$lib/format-date'
  import { trimText } from '$lib/trim-text'
  import type { MediaArticle, Metadata } from '$lib/types'
  import { onMount } from 'svelte'
  import {
    deleteArticles,
    fetchArticlesWrapper,
    type Filters
  } from '$lib/api-utils'
  import { addToast } from '$components/Toaster.svelte'
  import {
    deleteSuccessMsg,
    deleteErrorMsg,
    fetchErrorMsg
  } from '$lib/toast-messages'
  import { calculateNewPage } from '$lib/pagination'

  let isLoading = false
  let articles: MediaArticle[] = []
  let metadata: Metadata
  let selected: number[] = []
  let alertDialog: DeleteAlertDialog

  const fetchArticles = fetchArticlesWrapper()

  onMount(async () => {
    isLoading = true
    await load()
    isLoading = false
  })

  async function load(filters: Filters = {}) {
    filters = { page: 1, ...filters }
    const res = await fetchArticles(filters)
    if (!res.ok) {
      addToast(fetchErrorMsg)
      return
    }
    articles = res.data.articles
    metadata = res.data.metadata
  }

  async function search(e: CustomEvent<{ search: string }>) {
    await load({ page: 1, title: e.detail.search })
  }

  async function sort(e: CustomEvent<{ sortValue: string }>) {
    await load({ page: 1, sort: e.detail.sortValue })
  }

  function toggleSelect(id: number) {
    if (selected.includes(id)) {
      selected = selected.filter(e => e !== id)
    } else {
      selected = [...selected, id]
    }
  }

  function toggleSelectAll() {
    if (selected.length === articles.length) {
      selected = []
    } else {
      selected = articles.map(e => e.id)
    }
  }

  async function deleteSelected() {
    const ok = await deleteArticles(selected)
    if (!ok) {
      addToast(deleteErrorMsg)
      return
    }

    addToast(deleteSuccessMsg)
    selected = []
    alertDialog.dismiss()

    await load()
  }

  async function selectPage(e: CustomEvent<{ page: number }>) {
    await load({ page: e.detail.page })
  }

  async function selectPageSize(e: CustomEvent<{ size: number }>) {
    const newPageSize = e.detail.size
    const { currentPage, pageSize: currentPageSize } = metadata

    if (newPageSize === currentPageSize) return

    const page = calculateNewPage(currentPage, currentPageSize, newPageSize)

    await load({ page, pageSize: newPageSize })
  }
</script>

<PageHeader>
  <svelte:fragment slot="heading">ЗМІ про заповідник</svelte:fragment>
  <LinkButton slot="right-items" href="/content/media-articles/create">
    <Plus slot="icon" size={16} />
    Cтворити
  </LinkButton>
</PageHeader>

<Container title="Події">
  <div class="mb-5">
    <SearchBar on:search={search}>
      <ContentSortMenu slot="filters" on:select={sort} />
    </SearchBar>
  </div>
  <RecordActionBar bind:selected on:delete={() => alertDialog.show()} />
  {#if articles.length === 0 && isLoading}
    <TableSkeleton />
  {:else if articles.length === 0 && !isLoading}
    <div class="mt-10">
      <EmptySearchMessage />
    </div>
  {:else}
    <Table>
      <thead>
        <tr>
          <TableHeader>
            <input
              type="checkbox"
              checked={selected.length === articles.length &&
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
        {#each articles as article}
          <TableRow>
            <TableData>
              <input
                type="checkbox"
                on:input={() => toggleSelect(article.id)}
                checked={selected.includes(article.id)}
              />
            </TableData>
            <TableData class="w-full">
              <a
                href={`/content/media-articles/${article.id}`}
                class="block w-full"
              >
                {trimText(article.title)}
              </a>
            </TableData>
            <TableData>{formatDate(article.updatedAt)}</TableData>
            <TableData>{article.user.fullName}</TableData>
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
