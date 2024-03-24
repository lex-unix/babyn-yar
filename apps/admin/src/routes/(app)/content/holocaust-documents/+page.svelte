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
    Pagination
  } from '$components'
  import { File, Plus, History, User } from 'lucide-svelte'
  import { formatDate, trimText } from '$lib'
  import type { HolocaustDocument, Metadata } from '$lib/types'
  import { onMount } from 'svelte'
  import {
    deleteHolocaustDocuments,
    fetchHolocaustDocumentsWrapper
  } from '$lib'
  import { addToast } from '$components/Toaster.svelte'

  const fetchHolocaustDocuments = fetchHolocaustDocumentsWrapper()

  let isLoading = false
  let documents: HolocaustDocument[] = []
  let metadata: Metadata
  let selected: number[] = []
  let alertDialog: DeleteAlertDialog

  onMount(async () => {
    isLoading = true
    const response = await fetchHolocaustDocuments()
    if (response.ok) {
      documents = response.data.documents
      metadata = response.data.metadata
    }
    isLoading = false
  })

  function toggleSelect(id: number) {
    if (selected.includes(id)) {
      selected = selected.filter(e => e !== id)
    } else {
      selected = [...selected, id]
    }
  }

  function toggleSelectAll() {
    if (selected.length === documents.length) {
      selected = []
    } else {
      selected = documents.map(e => e.id)
    }
  }

  async function deleteSelected() {
    const { ok } = await deleteHolocaustDocuments(selected)
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
    const res = await fetchHolocaustDocuments()
    if (res.ok) {
      documents = res.data.documents
      metadata = res.data.metadata
    }
  }

  async function selectPage(e: CustomEvent<{ page: number }>) {
    const { page } = e.detail
    const response = await fetchHolocaustDocuments(page)
    if (response.ok) {
      documents = response.data.documents
      metadata = response.data.metadata
    }
  }
</script>

<PageHeader>
  <svelte:fragment slot="heading">Документи Голокосту</svelte:fragment>
  <LinkButton slot="right-items" href="/content/holocaust-documents/create">
    <Plus slot="icon" size={16} />
    Cтворити
  </LinkButton>
</PageHeader>

<Container title="Документи Голокосту">
  <RecordActionBar bind:selected on:delete={() => alertDialog.show()} />
  {#if documents.length === 0 || isLoading}
    <TableSkeleton />
  {:else}
    <Table>
      <thead>
        <tr>
          <TableHeader>
            <input
              type="checkbox"
              checked={selected.length === documents.length &&
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
        {#each documents as doc}
          <TableRow>
            <TableData>
              <input
                type="checkbox"
                on:input={() => toggleSelect(doc.id)}
                checked={selected.includes(doc.id)}
              />
            </TableData>
            <TableData class="w-full">
              <a href={`/content/holocaust-documents/${doc.id}`}>
                {trimText(doc.title)}
              </a>
            </TableData>
            <TableData>{formatDate(doc.updatedAt)}</TableData>
            <TableData>{doc.user.fullName}</TableData>
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
