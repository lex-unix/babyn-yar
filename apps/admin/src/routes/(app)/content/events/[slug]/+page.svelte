<script lang="ts">
  import { page } from '$app/stores'
  import {
    Input,
    LangSelect,
    CoverSelect,
    RichTextEditor,
    PageHeader,
    Button,
    Container,
    NotFound
  } from '$components'
  import type { Event } from '$lib/types'
  import { fetchEvent, updateEvent, ResponseError } from '$lib'
  import { onMount } from 'svelte'
  import { addToast } from '$components/Toaster.svelte'
  import { SaveIcon } from 'lucide-svelte'

  let isSubmitting = false
  let isLoading = true
  let event: Event
  let error: ResponseError | undefined

  onMount(async function () {
    const response = await fetchEvent($page.params.slug)
    if (response.ok) {
      event = response.event
      isLoading = false
      return
    }
    error = response.error
    isLoading = false
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
    const response = await updateEvent($page.params.slug, body)
    if (!response.ok) {
      error = response.error
      isSubmitting = false
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
    isSubmitting = false
  }
</script>

{#if !error?.isNotFoundError() && !isLoading}
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
      <form
        on:submit|preventDefault={submit}
        id="edit-record"
        class="space-y-5"
      >
        <LangSelect
          bind:lang={event.lang}
          error={error?.isFormError() ? error.error.lang : undefined}
        />
        <CoverSelect
          bind:cover={event.cover}
          error={error?.isFormError() ? error.error.cover : undefined}
        />
        <Input
          bind:value={event.title}
          name="title"
          label="Назва"
          error={error?.isFormError() ? error.error.title : undefined}
        />
        <Input
          bind:value={event.description}
          name="description"
          label="Опис"
          error={error?.isFormError() ? error.error.description : undefined}
        />
        <div>
          <p class="mb-1.5 text-gray-500">Контент</p>
          {#if error?.isFormError() && error?.error.content}
            <p class="text-red-500">{error.error.content}</p>
          {/if}
          <RichTextEditor bind:content={event.content} />
        </div>
      </form>
    {/if}
  </Container>
{:else if error?.isNotFoundError()}
  <NotFound />
{/if}
