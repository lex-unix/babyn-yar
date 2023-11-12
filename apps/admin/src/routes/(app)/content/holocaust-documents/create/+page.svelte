<script lang="ts">
  import {
    Input,
    RichTextEditor,
    LangSelect,
    CoverSelect,
    Button,
    PageHeader,
    Container
  } from '$components'
  import { createHolocaustDocument, ResponseError } from '$lib'
  import type { JSONContent } from '@tiptap/core'
  import { PlusIcon } from 'lucide-svelte'
  import { addToast } from '$components/Toaster.svelte'
  import { goto } from '$app/navigation'

  let isSubmitting = false
  let content: JSONContent
  let title = ''
  let description = ''
  let lang = ''
  let cover = ''
  let error: ResponseError | undefined

  async function submit() {
    isSubmitting = true
    const body = JSON.stringify({
      title,
      description,
      lang,
      cover,
      content: JSON.stringify(content)
    })
    const response = await createHolocaustDocument(body)
    if (!response.ok) {
      error = response.error
      isSubmitting = false
      return
    }
    addToast({
      data: {
        title: 'Чудово!',
        description: 'Новий запис було успішно створено',
        variant: 'success'
      }
    })
    isSubmitting = false
    error = undefined
    goto('/content/holocaust-documents')
  }
</script>

<svelte:head>
  <title>Створити новий запис</title>
</svelte:head>

<PageHeader>
  <svelte:fragment slot="heading">Новий запис</svelte:fragment>
  <Button
    slot="right-items"
    isLoading={isSubmitting}
    loadingText="Створення..."
    form="create-record"
  >
    <PlusIcon size={16} slot="icon" />
    Створити
  </Button>
</PageHeader>

<Container title="Створити новий запис">
  <form id="create-record" on:submit|preventDefault={submit} class="space-y-5">
    <LangSelect
      bind:lang
      error={error?.isFormError() ? error.error.lang : undefined}
    />
    <CoverSelect
      bind:cover
      error={error?.isFormError() ? error.error.cover : undefined}
    />
    <Input
      name="title"
      label="Назва"
      error={error?.isFormError() ? error.error.title : undefined}
      bind:value={title}
      required
    />
    <Input
      name="description"
      label="Опис"
      error={error?.isFormError() ? error.error.description : undefined}
      bind:value={description}
      required
    />
    <div>
      <p class="mb-1.5 text-gray-500">Контент</p>
      {#if error?.isFormError() && error?.error.content}
        <p class="text-red-500">{error.error.content}</p>
      {/if}
      <RichTextEditor bind:content />
    </div>
  </form>
</Container>
