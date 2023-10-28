<script lang="ts">
  import { page } from '$app/stores'
  import { Input, LangSelect, CoverSelect, RichTextEditor } from '$components'
  import type { Event } from '$lib/types'
  import { fetchEvent, updateEvent } from '$lib'
  import type { EventErrorResponse } from '$lib/types'
  import { onMount } from 'svelte'
  import { addToast } from '$components/Toaster.svelte'

  let loading = false
  let event: Event
  let errors: EventErrorResponse | undefined
  let editorElement: HTMLDivElement

  onMount(async function () {
    event = await fetchEvent($page.params.slug)
  })

  async function submit() {
    loading = true
    const body = JSON.stringify({
      title: event.title,
      description: event.description,
      lang: event.lang,
      cover: event.cover,
      content: JSON.stringify(event.content)
    })
    const res = await updateEvent($page.params.slug, body)
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
    loading = false
  }
</script>

<svelte:head>
  <title>Редагувати подію</title>
</svelte:head>

<div class="mb-10">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-semibold">Редагування події</h1>
    <button
      form="edit-event"
      disabled={loading}
      class="flex items-center gap-3 rounded-md border border-sky-700/10 bg-teal-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
    >
      {#if loading}
        Збереження
      {:else}
        Зберегти зміни
      {/if}
    </button>
  </div>
</div>

<div>
  {#if event}
    <form on:submit|preventDefault={submit} id="edit-event" class="space-y-5">
      <LangSelect bind:lang={event.lang} />
      <CoverSelect bind:cover={event.cover} />
      <Input
        bind:value={event.title}
        name="title"
        label="Назва"
        error={errors?.title}
        required
      />
      <Input
        bind:value={event.description}
        name="description"
        label="Опис"
        error={errors?.description}
        required
      />
      <div>
        <p class="mb-1.5 text-gray-400">Контент</p>
        <RichTextEditor bind:content={event.content} />
        <div bind:this={editorElement} />
      </div>
    </form>
  {/if}
</div>
