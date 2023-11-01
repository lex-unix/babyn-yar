<script lang="ts">
  import {
    Input,
    RichTextEditor,
    LangSelect,
    CoverSelect,
    DocumentsSelect,
    Button,
    PageHeader,
    Container
  } from '$components'
  import { createBook } from '$lib'
  import type { JSONContent } from '@tiptap/core'
  import { PlusIcon } from 'lucide-svelte'
  import { addToast } from '$components/Toaster.svelte'
  import type { TestimonyErrorResponse } from '$lib/types'
  import { goto } from '$app/navigation'

  let isSubmitting = false
  let content: JSONContent
  let errors: TestimonyErrorResponse | undefined
  let title = ''
  let description = ''
  let lang = ''
  let cover = ''
  let documents: string[] = []

  async function submit() {
    isSubmitting = true
    const body = JSON.stringify({
      title,
      description,
      lang,
      cover,
      documents,
      content: JSON.stringify(content)
    })
    const response = await createBook(body)
    if (!response.ok) {
      errors = response.errors
    } else {
      addToast({
        data: {
          title: 'Чудово!',
          description: 'Новий запис було успішно створено',
          color: 'bg-emerald-500'
        }
      })
      goto('/content/library')
    }
    isSubmitting = false
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
    <LangSelect bind:lang error={errors?.lang} />
    <CoverSelect bind:cover error={errors?.cover} />
    <Input
      name="title"
      label="Назва"
      error={errors?.title}
      bind:value={title}
      required
    />
    <Input
      name="description"
      label="Опис"
      error={errors?.description}
      bind:value={description}
      required
    />
    <DocumentsSelect bind:documents />
    <div>
      <p class="mb-1.5 text-gray-400">Контент</p>
      {#if errors?.content}
        <p class="text-red-500">{errors.content}</p>
      {/if}
      <RichTextEditor bind:content />
    </div>
  </form>
</Container>
