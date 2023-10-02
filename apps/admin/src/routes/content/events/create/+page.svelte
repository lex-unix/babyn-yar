<script lang="ts">
  import { Input, RichTextEditor } from '$components'
  import { createEvent } from '$lib'
  import type { JSONContent } from '@tiptap/core'
  import { PlusIcon } from 'lucide-svelte'
  import type { EventErrorResponse } from '$lib/types'

  let loading = false
  let content: JSONContent
  let errors: EventErrorResponse | undefined
  let title = ''
  let description = ''

  async function submit() {
    loading = true
    const body = JSON.stringify({
      title,
      description,
      content: JSON.stringify(content)
    })
    const response = await createEvent(body)
    if (!response.ok) {
      errors = response.errors
    }
    loading = false
  }
</script>

<div class="flex items-center justify-between">
  <h1 class="text-2xl font-semibold">Нова подія</h1>
  <button
    form="create-event"
    class="flex items-center gap-3 rounded-md border border-sky-700/10 bg-teal-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
    disabled={loading}
  >
    <PlusIcon size={16} />
    <span>
      {#if loading}
        Створення...
      {:else}
        Створити
      {/if}
    </span>
  </button>
</div>

<div class="pt-10">
  <form id="create-event" on:submit|preventDefault={submit} class="space-y-5">
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
</div>
