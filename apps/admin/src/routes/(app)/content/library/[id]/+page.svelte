<script lang="ts">
  import { page } from '$app/stores'
  import {
    Input,
    LangSelect,
    CoverSelect,
    RichTextEditor,
    DocumentsSelect,
    Button,
    PageHeader,
    Container
  } from '$components'
  import type { Book } from '$lib/types'
  import { fetchBook, updateBook } from '$lib'
  import type { TestimonyErrorResponse } from '$lib/types'
  import { onMount } from 'svelte'
  import { addToast } from '$components/Toaster.svelte'
  import { SaveIcon } from 'lucide-svelte'

  let isLoading = false
  let book: Book
  let errors: TestimonyErrorResponse | undefined

  onMount(async function () {
    const res = await fetchBook($page.params.id)
    if (res.ok) {
      book = res.book
    }
  })

  async function submit() {
    isLoading = true
    const body = JSON.stringify({
      title: book.title,
      description: book.description,
      lang: book.lang,
      cover: book.cover,
      documents: book.documents,
      content: JSON.stringify(book.content)
    })
    const res = await updateBook($page.params.id, body)
    if (!res.ok) {
      errors = errors
    } else {
      addToast({
        data: {
          title: 'Чудово!',
          description: 'Ваші зміни було збережено',
          color: 'bg-emerald-500'
        }
      })
    }
    isLoading = false
  }
</script>

<PageHeader>
  <svelte:fragment slot="heading">Редагувати запис</svelte:fragment>
  <Button slot="right-items" {isLoading} form="edit-record">
    <SaveIcon size={16} slot="icon" />
    Зберегти зміни
  </Button>
</PageHeader>

<Container title="Редагувати запис">
  {#if book}
    <form on:submit|preventDefault={submit} id="edit-record" class="space-y-5">
      <LangSelect bind:lang={book.lang} />
      <CoverSelect bind:cover={book.cover} />
      <Input
        bind:value={book.title}
        name="title"
        label="Назва"
        error={errors?.title}
        required
      />
      <Input
        bind:value={book.description}
        name="description"
        label="Опис"
        error={errors?.description}
        required
      />
      <DocumentsSelect bind:documents={book.documents} />
      <div>
        <p class="mb-1.5 text-gray-400">Контент</p>
        <RichTextEditor bind:content={book.content} />
      </div>
    </form>
  {/if}
</Container>
