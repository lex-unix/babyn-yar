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
    DatePicker,
    TranslationSelect
  } from '$components'
  import type { MediaArticle, Translation } from '$lib/types'
  import type { ResponseError } from '$lib/response-error'
  import { fetchArticle, getArticles, updateArticle } from '$lib/api-utils'
  import { onMount } from 'svelte'
  import { addToast } from '$components/Toaster.svelte'
  import { SaveIcon } from 'lucide-svelte'
  import { updateRecordSuccessMsg } from '$lib/toast-messages'

  let isSubmitting = false
  let article: MediaArticle
  let translations: Translation[] = []
  let selectedTranslation: Translation | undefined
  let error: ResponseError | undefined

  onMount(async function () {
    const response = await fetchArticle($page.params.id)
    if (!response.ok) {
      error = response.error
      return
    }
    article = response.data.article
    article.content = JSON.parse(article.content as unknown as string)

    if (response.data.translation) {
      const translation = response.data.translation
      selectedTranslation =
        article.lang === 'ua'
          ? { id: translation.englishId, title: translation.englishTitle }
          : { id: translation.ukrainianId, title: translation.ukrainianTitle }
    }

    const translationResponse = await getArticles()
    if (translationResponse.ok) {
      translations = translationResponse.data.articles
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
      content: JSON.stringify(article.content),
      translationId: selectedTranslation ? selectedTranslation.id : null
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

  async function searchTranslations(e: CustomEvent<{ search: string }>) {
    const response = await getArticles({ title: e.detail.search })
    if (response.ok) {
      translations = response.data.articles
    }
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
        <TranslationSelect
          {translations}
          bind:selected={selectedTranslation}
          on:search={searchTranslations}
        />
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
