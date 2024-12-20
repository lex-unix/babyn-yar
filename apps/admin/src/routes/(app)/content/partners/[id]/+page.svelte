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
  import type { Partner, Translation } from '$lib/types'
  import type { ResponseError } from '$lib/response-error'
  import { getPartner, getPartners, updatePartner } from '$lib/api-utils'
  import { onMount } from 'svelte'
  import { addToast } from '$components/Toaster.svelte'
  import { SaveIcon } from 'lucide-svelte'

  let isSubmitting = false
  let isLoading = false
  let partner: Partner
  let translations: Translation[] = []
  let selectedTranslation: Translation | undefined
  let error: ResponseError | undefined

  onMount(async function () {
    isLoading = true
    const response = await getPartner($page.params.id)
    if (!response.ok) {
      error = response.error
      isLoading = false
      return
    }
    partner = response.data.partner
    partner.content = JSON.parse(partner.content as unknown as string)
    isLoading = false

    if (response.data.translation) {
      const translation = response.data.translation
      selectedTranslation =
        partner.lang === 'ua'
          ? { id: translation.englishId, title: translation.englishTitle }
          : { id: translation.ukrainianId, title: translation.ukrainianTitle }
    }

    const translationResponse = await getPartners()
    if (translationResponse.ok) {
      translations = translationResponse.data.partners
    }
  })

  async function submit() {
    isSubmitting = true
    const body = JSON.stringify({
      title: partner.title,
      description: partner.description,
      lang: partner.lang,
      cover: partner.cover,
      content: JSON.stringify(partner.content),
      occuredOn: new Date(partner.occuredOn).toISOString(),
      translationId: selectedTranslation ? selectedTranslation.id : null
    })
    const response = await updatePartner($page.params.id, body)
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
    const response = await getPartners({ title: e.detail.search })
    if (response.ok) {
      translations = response.data.partners
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
    {#if !partner || isLoading}
      <EditorSkeleton />
    {:else}
      <form
        on:submit|preventDefault={submit}
        id="edit-record"
        class="space-y-5"
      >
        <LangSelect
          bind:lang={partner.lang}
          error={error?.isFormError() ? error.error.lang : undefined}
        />
        <DatePicker bind:datetime={partner.occuredOn} />
        <TranslationSelect
          {translations}
          bind:selected={selectedTranslation}
          on:search={searchTranslations}
        />
        <CoverSelect
          bind:cover={partner.cover}
          error={error?.isFormError() ? error.error.cover : undefined}
        />
        <Input
          bind:value={partner.title}
          name="title"
          label="Назва"
          error={error?.isFormError() ? error.error.title : undefined}
        />
        <Input
          bind:value={partner.description}
          name="description"
          label="Опис"
          error={error?.isFormError() ? error.error.description : undefined}
        />
        <div>
          <p class="mb-1.5 text-gray-500">Контент</p>
          {#if error?.isFormError() && error?.error.content}
            <p class="text-red-500">{error.error.content}</p>
          {/if}
          <RichTextEditor bind:content={partner.content} />
        </div>
      </form>
    {/if}
  </Container>
{:else if error?.isNotFoundError()}
  <NotFound />
{/if}
