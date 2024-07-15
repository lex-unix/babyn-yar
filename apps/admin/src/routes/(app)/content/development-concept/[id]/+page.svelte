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
    DatePicker
  } from '$components'
  import type { DevConcept } from '$lib/types'
  import type { ResponseError } from '$lib/response-error'
  import { getDevConcept, updateDevConcept } from '$lib/api-utils'
  import { onMount } from 'svelte'
  import { addToast } from '$components/Toaster.svelte'
  import { SaveIcon } from 'lucide-svelte'

  let isSubmitting = false
  let isLoading = false
  let concept: DevConcept
  let error: ResponseError | undefined

  onMount(async function () {
    isLoading = true
    const response = await getDevConcept($page.params.id)
    if (response.ok) {
      concept = response.data.concept
      concept.content = JSON.parse(concept.content as unknown as string)
      isLoading = false
      return
    }
    error = response.error
    isLoading = false
  })

  async function submit() {
    isSubmitting = true
    const body = JSON.stringify({
      title: concept.title,
      description: concept.description,
      lang: concept.lang,
      cover: concept.cover,
      content: JSON.stringify(concept.content),
      occuredOn: new Date(concept.occuredOn).toISOString()
    })
    const response = await updateDevConcept($page.params.id, body)
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
    {#if !concept || isLoading}
      <EditorSkeleton />
    {:else}
      <form
        on:submit|preventDefault={submit}
        id="edit-record"
        class="space-y-5"
      >
        <LangSelect
          bind:lang={concept.lang}
          error={error?.isFormError() ? error.error.lang : undefined}
        />
        <DatePicker bind:datetime={concept.occuredOn} />
        <CoverSelect
          bind:cover={concept.cover}
          error={error?.isFormError() ? error.error.cover : undefined}
        />
        <Input
          bind:value={concept.title}
          name="title"
          label="Назва"
          error={error?.isFormError() ? error.error.title : undefined}
        />
        <Input
          bind:value={concept.description}
          name="description"
          label="Опис"
          error={error?.isFormError() ? error.error.description : undefined}
        />
        <div>
          <p class="mb-1.5 text-gray-500">Контент</p>
          {#if error?.isFormError() && error?.error.content}
            <p class="text-red-500">{error.error.content}</p>
          {/if}
          <RichTextEditor bind:content={concept.content} />
        </div>
      </form>
    {/if}
  </Container>
{:else if error?.isNotFoundError()}
  <NotFound />
{/if}
