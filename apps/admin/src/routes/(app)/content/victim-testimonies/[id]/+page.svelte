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
  import { fetchTestimony, updateTestimony } from '$lib'
  import type { TestimonyErrorResponse } from '$lib/types'
  import { onMount } from 'svelte'
  import { addToast } from '$components/Toaster.svelte'
  import { SaveIcon } from 'lucide-svelte'

  let isSubmitting = false
  let testimony: VictimTestimony
  let errors: TestimonyErrorResponse | undefined

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
    const res = await updateTestimony($page.params.id, body)
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

<Container title="Редагування запису">
  {#if testimony}
    <form on:submit|preventDefault={submit} id="edit-record" class="space-y-5">
      <LangSelect bind:lang={testimony.lang} />
      <CoverSelect bind:cover={testimony.cover} />
      <Input
        bind:value={testimony.title}
        name="title"
        label="Назва"
        error={errors?.title}
        required
      />
      <Input
        bind:value={testimony.description}
        name="description"
        label="Опис"
        error={errors?.description}
        required
      />
      <DocumentsSelect bind:documents={testimony.documents} />
      <div>
        <p class="mb-1.5 text-gray-400">Контент</p>
        <RichTextEditor bind:content={testimony.content} />
      </div>
    </form>
  {/if}
</Container>
