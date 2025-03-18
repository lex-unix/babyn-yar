<script lang="ts">
  import { PageHeader, Container, AssetDialog } from '$components'
  import { PlusIcon, Trash2Icon } from 'lucide-svelte'
  import type { GalleryImage } from '$lib/types'
  import {
    useGalleryImages,
    useDeleteGalleryImage,
    useCreateGalleryImage
  } from '$lib/gallery/query'

  const images = useGalleryImages()
  const deleteImage = useDeleteGalleryImage()
  const createImage = useCreateGalleryImage()

  let assetDialog: AssetDialog

  async function addImage(e: CustomEvent<{ id: number; url: string }>) {
    $createImage.mutate({ url: e.detail.url, id: e.detail.id })
  }

  async function removeImage(image: GalleryImage) {
    $deleteImage.mutate(image.id)
  }
</script>

<PageHeader>
  <svelte:fragment slot="heading">Галерея</svelte:fragment>
</PageHeader>
<Container title="Галерея">
  {#if $images.isSuccess}
    <div
      class="grid auto-rows-[148px] grid-cols-[repeat(auto-fill,minmax(166px,1fr))] gap-2 rounded-md border bg-white p-2 shadow-sm"
    >
      {#each $images.data.images as image}
        <div class="group relative overflow-hidden rounded-md">
          <img
            src={image.url}
            alt=""
            class="aspect-square h-auto w-full object-cover"
          />
          <div
            class="absolute inset-0 z-10 hidden bg-black/60 group-hover:block"
          >
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
        on:click={() => assetDialog && assetDialog.open('image')}
      >
        <PlusIcon />
      </button>
    </div>
  {/if}
</Container>

<AssetDialog bind:this={assetDialog} on:select={addImage} />
