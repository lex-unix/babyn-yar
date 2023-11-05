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
    ErrorMessage
  } from '$components'
  import { File, Plus, History, User } from 'lucide-svelte'
  import { formatDate, trimText } from '$lib'
  import type { HolocaustDocument } from '$lib/types'
  import { onMount } from 'svelte'
  import { fetchHolocaustDocuments, deleteHolocaustDocuments } from '$lib'
  import { addToast } from '$components/Toaster.svelte'

  let documents: HolocaustDocument[] = []
  let selected: number[] = []
  let alertDialog: DeleteAlertDialog
  let isError = false

  onMount(async () => {
    const response = await fetchHolocaustDocuments()
    isError = !response.ok
    if (response.ok) {
      documents = response.data.documents
    }
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
          color: 'bg-emerald-500'
        }
      })
      return
    }
    documents = documents.filter(e => !selected.includes(e.id))
    selected = []
    alertDialog.dismiss()
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
  <svelte:fragment slot="heading">Документи Голокосту</svelte:fragment>
  <LinkButton slot="right-items" href="/content/holocaust-documents/create">
    <Plus slot="icon" size={16} />
    Cтворити
  </LinkButton>
</PageHeader>

<Container title="Документи Голокосту">
  <RecordActionBar bind:selected on:delete={() => alertDialog.show()} />
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
            <TableData>
              <a href={`/content/holocaust-documents/${doc.id}`}>
                {trimText(doc.title)}
              </a>
            </TableData>
            <TableData>{formatDate(doc.updatedAt)}</TableData>
            <TableData>{doc.user.fullName}</TableData>
          </TableRow>
        {/each}
      </tbody>
    </Table>
  {/if}
</Container>

<DeleteAlertDialog bind:this={alertDialog} on:confirm={deleteSelected} />
