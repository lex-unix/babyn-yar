<script lang="ts">
  import {
    Input,
    RichTextEditor,
    LangSelect,
    CoverSelect,
    PageHeader,
    Container,
    Button
  } from '$components'
  import { createEvent } from '$lib'
  import type { JSONContent } from '@tiptap/core'
  import { PlusIcon } from 'lucide-svelte'
  import { addToast } from '$components/Toaster.svelte'
  import type { EventErrorResponse } from '$lib/types'
  import { goto } from '$app/navigation'

  let isSubmitting = false
  let content: JSONContent
  let errors: EventErrorResponse | undefined
  let title = ''
  let description = ''
  let lang = ''
  let cover = ''

  async function submit() {
    isSubmitting = true
    const body = JSON.stringify({
      title,
      description,
      lang,
      cover,
      content: JSON.stringify(content)
    })
    const response = await createEvent(body)
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
      goto('/content/events')
    }
    isSubmitting = false
  }
</script>

<PageHeader>
  <svelte:fragment slot="heading">Новий запис</svelte:fragment>
  <Button
    slot="right-items"
    isLoading={isSubmitting}
    loadingText="Створення..."
    form="create-record"
  >
    <PlusIcon slot="icon" size={16} />
    Створити
  </Button>
</PageHeader>

<Container title="Створити запис">
  <form id="create-record" on:submit|preventDefault={submit} class="space-y-5">
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
    <div>
      <p class="mb-1.5 text-gray-400">Контент</p>
      {#if errors?.content}
        <p class="text-red-500">{errors.content}</p>
      {/if}
      <RichTextEditor bind:content />
    </div>
  </form>
</Container>
