<script lang="ts">
  import { Input, RichTextEditor } from '$components'
  import type { JSONContent } from '@tiptap/core'
  import { PlusIcon } from 'lucide-svelte'
  import type { EventErrorResponse } from '$lib'

  let content: JSONContent
  let errors: EventErrorResponse | undefined
  let title = ''
  let description = ''

  async function submit() {
    const body = JSON.stringify({
      title,
      description,
      content: JSON.stringify(content)
    })
    const res = await fetch('http://localhost:8000/v1/events', {
      method: 'POST',
      body
    })
    if (!res.ok) {
      const json = await res.json()
      console.log(json)
      errors = json.error
    }
  }
</script>

<div class="flex items-center justify-between">
  <h1 class="text-2xl font-semibold">Нова подія</h1>
  <button
    form="create-event"
    class="flex items-center gap-3 rounded-md border border-sky-700/10 bg-teal-500 px-4 py-2 text-sm font-medium text-white"
  >
    <PlusIcon size={16} />
    <span>Створити</span>
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
