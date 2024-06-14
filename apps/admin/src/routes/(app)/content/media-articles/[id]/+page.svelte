<script lang="ts">
  import { page } from '$app/stores'
  import {
    Input,
    LangSelect,
    CoverSelect,
    RichTextEditor,
    Button,
    PageHeader,
    Container,
    NotFound,
    DatePicker
  } from '$components'
  import type { MediaArticle } from '$lib/types'
  import type { ResponseError } from '$lib/response-error'
  import { fetchArticle, updateArticle } from '$lib/api-utils'
  import { onMount } from 'svelte'
  import { addToast } from '$components/Toaster.svelte'
  import { SaveIcon } from 'lucide-svelte'
  import { updateRecordSuccessMsg } from '$lib/toast-messages'

  let isSubmitting = false
  let article: MediaArticle
  let error: ResponseError | undefined

  onMount(async function () {
    const res = await fetchArticle($page.params.id)
    if (res.ok) {
      article = res.data.article
      article.content = JSON.parse(article.content as unknown as string)
    } else {
      error = res.error
    }
  })

  async function submit() {
    isSubmitting = true
    const body = JSON.stringify({
      occuredOn: new Date(article.occuredOn).toISOString(),
      title: article.title,
      description: article.description,
      lang: article.lang,
      cover: article.cover,
      content: JSON.stringify(article.content)
    })
    const response = await updateArticle($page.params.id, body)
    if (!response.ok) {
      error = response.error
      isSubmitting = false
      return
    }
    addToast(updateRecordSuccessMsg)
    isSubmitting = false
    error = undefined
  }
</script>

{#if !error?.isNotFoundError()}
  <PageHeader>
    <svelte:fragment slot="heading">Редагувати запис</svelte:fragment>
    <Button slot="right-items" isLoading={isSubmitting} form="edit-record">
      <SaveIcon size={16} slot="icon" />
      Зберегти зміни
    </Button>
  </PageHeader>

  <Container title="Редагувати запис">
    {#if article}
      <form
        on:submit|preventDefault={submit}
        id="edit-record"
        class="space-y-5"
      >
        <LangSelect
          bind:lang={article.lang}
          error={error?.isFormError() ? error.error.lang : undefined}
        />
        <DatePicker bind:datetime={article.occuredOn} />
        <CoverSelect
          bind:cover={article.cover}
          error={error?.isFormError() ? error.error.cover : undefined}
        />
        <Input
          bind:value={article.title}
          name="title"
          label="Назва"
          error={error?.isFormError() ? error.error.title : undefined}
          required
        />
        <Input
          bind:value={article.description}
          name="description"
          label="Опис"
          error={error?.isFormError() ? error.error.description : undefined}
          required
        />
        <div>
          <p class="mb-1.5 text-gray-500">Контент</p>
          {#if error?.isFormError() && error?.error.content}
            <p class="text-red-500">{error.error.content}</p>
          {/if}
          <RichTextEditor bind:content={article.content} />
        </div>
      </form>
    {/if}
  </Container>
{:else if error?.isNotFoundError()}
  <NotFound />
{/if}
