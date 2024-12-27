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
    Container,
    NotFound,
    DatePicker,
    TranslationSelect
  } from '$components'
  import type { Book, Translation } from '$lib/types'
  import type { ResponseError } from '$lib/response-error'
  import { fetchBook, getBooks, updateBook } from '$lib/api-utils'
  import { onMount } from 'svelte'
  import { addToast } from '$components/Toaster.svelte'
  import { SaveIcon } from 'lucide-svelte'
  import { updateRecordSuccessMsg } from '$lib/toast-messages'

  let isSubmitting = false
  let book: Book
  let translations: Translation[] = []
  let selectedTranslation: Translation | undefined
  let error: ResponseError | undefined

  onMount(async function () {
    const response = await fetchBook($page.params.id)
    if (!response.ok) {
      error = response.error
      return
    }
    book = response.data.book
    book.content = JSON.parse(book.content as unknown as string)

    if (response.data.translation) {
      const translation = response.data.translation
      selectedTranslation =
        book.lang === 'ua'
          ? { id: translation.englishId, title: translation.englishTitle }
          : { id: translation.ukrainianId, title: translation.ukrainianTitle }
    }

    const translationResponse = await getBooks()
    if (translationResponse.ok) {
      translations = translationResponse.data.books
    }
  })

  async function submit() {
    isSubmitting = true
    const body = JSON.stringify({
      occuredOn: new Date(book.occuredOn).toISOString(),
      title: book.title,
      description: book.description,
      lang: book.lang,
      cover: book.cover,
      documents: book.documents,
      content: JSON.stringify(book.content),
      translationId: selectedTranslation ? selectedTranslation.id : null
    })
    const response = await updateBook($page.params.id, body)
    if (!response.ok) {
      error = response.error
      isSubmitting = false
      return
    }
    addToast(updateRecordSuccessMsg)
    isSubmitting = false
    error = undefined
  }

  async function searchTranslations(e: CustomEvent<{ search: string }>) {
    const response = await getBooks({ title: e.detail.search })
    if (response.ok) {
      translations = response.data.books
    }
  }
</script>

{#if !error?.isNotFoundError()}
  <PageHeader>
    <svelte:fragment slot="heading">Редагувати запис</svelte:fragment>
    <Button slot="right-items" isLoading={isSubmitting} form="edit-record">
      <SaveIcon size={16} slot="icon" />
      Зберегти зміни
    </Button>
  </PageHeader>

  <Container title="Редагувати запис">
    {#if book}
      <form
        on:submit|preventDefault={submit}
        id="edit-record"
        class="space-y-5"
      >
        <LangSelect
          bind:lang={book.lang}
          error={error?.isFormError() ? error.error.lang : undefined}
        />
        <DatePicker bind:datetime={book.occuredOn} />
        <TranslationSelect
          {translations}
          bind:selected={selectedTranslation}
          on:search={searchTranslations}
        />
        <CoverSelect
          bind:cover={book.cover}
          error={error?.isFormError() ? error.error.cover : undefined}
        />
        <Input
          bind:value={book.title}
          name="title"
          label="Назва"
          error={error?.isFormError() ? error.error.title : undefined}
          required
        />
        <Input
          bind:value={book.description}
          name="description"
          label="Опис"
          error={error?.isFormError() ? error.error.description : undefined}
          required
        />
        <DocumentsSelect bind:documents={book.documents} />
        <div>
          <p class="mb-1.5 text-gray-500">Контент</p>
          {#if error?.isFormError() && error?.error.content}
            <p class="text-red-500">{error.error.content}</p>
          {/if}
          <RichTextEditor bind:content={book.content} />
        </div>
      </form>
    {/if}
  </Container>
{:else if error?.isNotFoundError()}
  <NotFound />
{/if}
