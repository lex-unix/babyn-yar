<script lang="ts">
  import { page } from '$app/stores'
  import {
    Input,
    LangSelect,
    CoverSelect,
    RichTextEditor,
    PageHeader,
    DocumentsSelect,
    Button,
    Container,
    NotFound,
    EditorSkeleton,
    DatePicker
  } from '$components'
  import type { LegalDocument } from '$lib/types'
  import type { ResponseError } from '$lib/response-error'
  import { getLegalDocument, updateLegalDocument } from '$lib/api-utils'
  import { onMount } from 'svelte'
  import { addToast } from '$components/Toaster.svelte'
  import { SaveIcon } from 'lucide-svelte'

  let isSubmitting = false
  let isLoading = false
  let legalDocument: LegalDocument
  let error: ResponseError | undefined

  onMount(async function () {
    isLoading = true
    const response = await getLegalDocument($page.params.id)
    if (response.ok) {
      legalDocument = response.data.document
      legalDocument.content = JSON.parse(
        legalDocument.content as unknown as string
      )
      isLoading = false
      return
    }
    error = response.error
    isLoading = false
  })

  async function submit() {
    isSubmitting = true
    const body = JSON.stringify({
      title: legalDocument.title,
      description: legalDocument.description,
      lang: legalDocument.lang,
      cover: legalDocument.cover,
      content: JSON.stringify(legalDocument.content),
      documents: legalDocument.documents,
      occuredOn: new Date(legalDocument.occuredOn).toISOString()
    })
    const response = await updateLegalDocument($page.params.id, body)
    isSubmitting = false
    if (!response.ok) {
      error = response.error
      return
    }
    addToast({
      data: {
        title: 'Чудово!',
        description: 'Ваші зміни було збережено',
        variant: 'success'
      }
    })
    error = undefined
  }
</script>

{#if !error?.isNotFoundError()}
  <PageHeader>
    <svelte:fragment slot="heading">Редагування запису</svelte:fragment>
    <Button
      slot="right-items"
      isLoading={isSubmitting}
      loadingText="Збереження..."
      form="edit-record"
    >
      <SaveIcon size={16} slot="icon" />
      Зберегти зміни
    </Button>
  </PageHeader>
  <Container title="Редагувати запис">
    {#if !legalDocument || isLoading}
      <EditorSkeleton />
    {:else}
      <form
        on:submit|preventDefault={submit}
        id="edit-record"
        class="space-y-5"
      >
        <LangSelect
          bind:lang={legalDocument.lang}
          error={error?.isFormError() ? error.error.lang : undefined}
        />
        <DatePicker bind:datetime={legalDocument.occuredOn} />
        <CoverSelect
          bind:cover={legalDocument.cover}
          error={error?.isFormError() ? error.error.cover : undefined}
        />
        <Input
          bind:value={legalDocument.title}
          name="title"
          label="Назва"
          error={error?.isFormError() ? error.error.title : undefined}
        />
        <Input
          bind:value={legalDocument.description}
          name="description"
          label="Опис"
          error={error?.isFormError() ? error.error.description : undefined}
        />
        <DocumentsSelect bind:documents={legalDocument.documents} />
        <div>
          <p class="mb-1.5 text-gray-500">Контент</p>
          {#if error?.isFormError() && error?.error.content}
            <p class="text-red-500">{error.error.content}</p>
          {/if}
          <RichTextEditor bind:content={legalDocument.content} />
        </div>
      </form>
    {/if}
  </Container>
{:else if error?.isNotFoundError()}
  <NotFound />
{/if}
