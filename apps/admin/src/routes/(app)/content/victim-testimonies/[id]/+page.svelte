<script lang="ts">
  import { page } from '$app/stores'
  import {
    Input,
    LangSelect,
    CoverSelect,
    RichTextEditor,
    DocumentsSelect,
    Button,
    PageHeader,
    Container
  } from '$components'
  import type { VictimTestimony } from '$lib/types'
  import { ResponseError, fetchTestimony, updateTestimony } from '$lib'
  import { onMount } from 'svelte'
  import { addToast } from '$components/Toaster.svelte'
  import { SaveIcon } from 'lucide-svelte'

  let isSubmitting = false
  let testimony: VictimTestimony
  let error: ResponseError | undefined

  onMount(async function () {
    testimony = await fetchTestimony($page.params.id)
  })

  async function submit() {
    isSubmitting = true
    const body = JSON.stringify({
      title: testimony.title,
      description: testimony.description,
      lang: testimony.lang,
      cover: testimony.cover,
      documents: testimony.documents,
      content: JSON.stringify(testimony.content)
    })
    const response = await updateTestimony($page.params.id, body)
    if (!response.ok) {
      error = response.error
      isSubmitting = false
      return
    }
    addToast({
      data: {
        title: 'Чудово!',
        description: 'Новий запис було успішно створено',
        variant: 'success'
      }
    })
    isSubmitting = false
    error = undefined
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

<Container title="Редагування запису">
  {#if testimony}
    <form on:submit|preventDefault={submit} id="edit-record" class="space-y-5">
      <LangSelect
        bind:lang={testimony.lang}
        error={error?.isFormError() ? error.error.lang : undefined}
      />
      <CoverSelect
        bind:cover={testimony.cover}
        error={error?.isFormError() ? error.error.cover : undefined}
      />
      <Input
        bind:value={testimony.title}
        name="title"
        label="Назва"
        error={error?.isFormError() ? error.error.title : undefined}
        required
      />
      <Input
        bind:value={testimony.description}
        name="description"
        label="Опис"
        error={error?.isFormError() ? error.error.description : undefined}
        required
      />
      <DocumentsSelect bind:documents={testimony.documents} />
      <div>
        <p class="mb-1.5 text-gray-400">Контент</p>
        {#if error?.isFormError() && error?.error.content}
          <p class="text-red-500">{error.error.content}</p>
        {/if}
        <RichTextEditor bind:content={testimony.content} />
      </div>
    </form>
  {/if}
</Container>
