<script lang="ts">
  import {
    Input,
    RichTextEditor,
    LangSelect,
    CoverSelect,
    DocumentsSelect,
    Button
  } from '$components'
  import { createTestimony } from '$lib'
  import type { JSONContent } from '@tiptap/core'
  import { PlusIcon } from 'lucide-svelte'
  import { addToast } from '$components/Toaster.svelte'
  import type { TestimonyErrorResponse } from '$lib/types'
  import { goto } from '$app/navigation'

  let loading = false
  let content: JSONContent
  let errors: TestimonyErrorResponse | undefined
  let title = ''
  let description = ''
  let lang = ''
  let cover = ''
  let documents: string[] = []

  async function submit() {
    loading = true
    const body = JSON.stringify({
      title,
      description,
      lang,
      cover,
      documents,
      content: JSON.stringify(content)
    })
    const response = await createTestimony(body)
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
      goto('/content/victim-testimonies')
    }
    loading = false
  }
</script>

<svelte:head>
  <title>Створити новий запис</title>
</svelte:head>

<div class="flex items-center justify-between">
  <h1 class="text-2xl font-semibold">Новий запис</h1>
  <Button isLoading={loading} loadingText="Створення..." form="create-event">
    <PlusIcon size={16} slot="icon" />
    Створити
  </Button>
</div>

<div class="pt-10">
  <form id="create-event" on:submit|preventDefault={submit} class="space-y-5">
    <LangSelect bind:lang />
    <CoverSelect bind:cover />
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
</div>
