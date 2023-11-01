<script lang="ts">
  import { page } from '$app/stores'
  import {
    Input,
    LangSelect,
    CoverSelect,
    RichTextEditor,
    PageHeader,
    Button,
    Container
  } from '$components'
  import type { Event } from '$lib/types'
  import { fetchEvent, updateEvent } from '$lib'
  import type { EventErrorResponse } from '$lib/types'
  import { onMount } from 'svelte'
  import { addToast } from '$components/Toaster.svelte'
  import { SaveIcon } from 'lucide-svelte'

  let isSubmitting = false
  let event: Event
  let errors: EventErrorResponse | undefined
  let editorElement: HTMLDivElement

  onMount(async function () {
    event = await fetchEvent($page.params.slug)
  })

  async function submit() {
    isSubmitting = true
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
    isSubmitting = false
  }
</script>

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
  {#if event}
    <form on:submit|preventDefault={submit} id="edit-record" class="space-y-5">
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
</Container>
