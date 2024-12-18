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
    NotFound,
    EditorSkeleton,
    DatePicker,
    TranslationSelect
  } from '$components'
  import type { Event, Translation } from '$lib/types'
  import type { ResponseError } from '$lib/response-error'
  import { getEvent, updateEvent, getEvents } from '$lib/api-utils'
  import { onMount } from 'svelte'
  import { addToast } from '$components/Toaster.svelte'
  import { SaveIcon } from 'lucide-svelte'

  let isSubmitting = false
  let isLoading = false
  let event: Event
  let translations: Translation[] = []
  let selectedTranslation: Translation | undefined
  let error: ResponseError | undefined

  onMount(async function () {
    isLoading = true
    const response = await getEvent($page.params.slug)
    if (!response.ok) {
      error = response.error
      isLoading = false
      return
    }
    event = response.data.event
    event.content = JSON.parse(event.content as unknown as string)
    isLoading = false

    if (response.data.translation) {
      const translation = response.data.translation
      selectedTranslation =
        event.lang === 'ua'
          ? { id: translation.englishId, title: translation.englishTitle }
          : { id: translation.ukrainianId, title: translation.ukrainianTitle }
    }

    const translationResponse = await getEvents()
    if (translationResponse.ok) {
      translations = translationResponse.data.events
    }
  })

  async function submit() {
    isSubmitting = true
    const body = JSON.stringify({
      title: event.title,
      description: event.description,
      lang: event.lang,
      cover: event.cover,
      content: JSON.stringify(event.content),
      occuredOn: new Date(event.occuredOn).toISOString(),
      translationId: selectedTranslation ? selectedTranslation.id : null
    })
    const response = await updateEvent($page.params.slug, body)
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

  async function searchTranslations(e: CustomEvent<{ search: string }>) {
    const response = await getEvents({ title: e.detail.search })
    if (response.ok) {
      translations = response.data.events
    }
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
    {#if !event || isLoading}
      <EditorSkeleton />
    {:else}
      <form
        on:submit|preventDefault={submit}
        id="edit-record"
        class="space-y-5"
      >
        <LangSelect
          bind:lang={event.lang}
          error={error?.isFormError() ? error.error.lang : undefined}
        />
        <DatePicker bind:datetime={event.occuredOn} />
        <TranslationSelect
          {translations}
          bind:selected={selectedTranslation}
          on:search={searchTranslations}
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
