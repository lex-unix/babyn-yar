<script lang="ts">
  import { PageHeader, Container, AssetDialog } from '$components'
  import { addToast } from '$components/Toaster.svelte'
  import {
    fetchErrorMsg,
    galleryImageExistsWarnMsg,
    gallertImageCreateErrorMsg,
    deleteErrorMsg
  } from '$lib/toast-messages'
  import { PlusIcon, Trash2Icon } from 'lucide-svelte'
  import { onMount } from 'svelte'
  import {
    fetchGalleryImages,
    createGalleryImage,
    deleteGalleryImage
  } from '$lib/api-utils'
  import type { GalleryImage } from '$lib/types'

  let images: GalleryImage[] = []
  let assetDialog: AssetDialog

  onMount(async () => {
    const response = await fetchGalleryImages()
    if (!response.ok) {
      addToast(fetchErrorMsg)
      return
    }
    images = response.data.images
  })

  function addImage() {
    assetDialog && assetDialog.open('image')
  }

  async function selectImage(e: CustomEvent<{ id: number; url: string }>) {
    const { id, url } = e.detail
    const exists = images.find(i => i.id === e.detail.id)
    if (exists) {
      addToast(galleryImageExistsWarnMsg)
      return
    }
    images = [...images, { id, url, createdAt: new Date().toISOString() }]
    assetDialog && assetDialog.close()
    const body = JSON.stringify({ url, id })
    const response = await createGalleryImage(body)
    if (!response.ok) {
      addToast(gallertImageCreateErrorMsg)
      images = images.filter(i => i.id !== id)
    }
  }

  async function removeImage(image: GalleryImage) {
    const index = images.indexOf(image)
    images = images.filter(i => i.id !== image.id)
    const response = await deleteGalleryImage(image.id)
    if (!response.ok) {
      addToast(deleteErrorMsg)
      images = [...images.slice(0, index), image, ...images.slice(index)]
    }
  }
</script>

<PageHeader>
  <svelte:fragment slot="heading">Галерея</svelte:fragment>
</PageHeader>
<Container title="Галерея">
  <div
    class="grid auto-rows-[148px] grid-cols-[repeat(auto-fill,minmax(166px,1fr))] gap-2 rounded-md border bg-white p-2 shadow-sm"
  >
    {#each images as image}
      <div class="group relative overflow-hidden rounded-md">
        <img
          src={image.url}
          alt=""
          class="aspect-square h-auto w-full object-cover"
        />
        <div class="absolute inset-0 z-10 hidden bg-black/60 group-hover:block">
          <div class="flex h-full w-full items-center justify-center">
            <button
              class="inline-flex items-center justify-center rounded-full border border-red-400/20 bg-red-600 p-2 text-sm font-medium text-red-50 transition-colors hover:bg-red-700 hover:text-red-100"
              on:click={() => removeImage(image)}
            >
              <Trash2Icon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    {/each}
    <button
      class="inline-flex items-center justify-center rounded-md border bg-gray-100 text-gray-400 focus-within:border-sky-400 focus-within:ring focus-within:ring-sky-100 hover:border-sky-400 hover:text-gray-600"
      on:click={addImage}
    >
      <PlusIcon />
    </button>
  </div>
</Container>

<AssetDialog bind:this={assetDialog} on:select={selectImage} />
