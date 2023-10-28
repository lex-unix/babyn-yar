<script lang="ts">
  import { AssetDialog } from '$components'
  import { ImageIcon, PlusIcon } from 'lucide-svelte'

  export let cover: string

  let assetDialog: AssetDialog

  function select(e: CustomEvent<{ url: string }>) {
    console.log(e.detail)
    cover = e.detail.url
    assetDialog.closeDialog()
  }
</script>

<div>
  <label for="select-cover" class="mb-1.5 block text-gray-400">
    Обкладинка
  </label>
  <button
    on:click={() => assetDialog.openDialog('image')}
    id="select-cover"
    type="button"
    class="flex w-full items-center gap-5 rounded border bg-white px-3 py-2"
  >
    <div
      class="flex h-20 w-[120px] items-center justify-center overflow-hidden rounded-lg bg-gray-100"
    >
      {#if cover}
        <img
          src={cover}
          alt="Event cover"
          class="h-full max-w-full object-contain"
        />
      {:else}
        <ImageIcon class="h-6 w-6" />
      {/if}
    </div>
    <div class="flex items-center gap-1">
      {#if cover}
        <button
          on:click|stopPropagation={() => assetDialog.openDialog('image')}
          type="button"
          class="text-sm"
        >
          Змінити
        </button>
      {:else}
        <PlusIcon class="h-4 w-4" />
        <p class="text-sm">Додати обкладинку</p>
      {/if}
    </div>
  </button>
</div>

<AssetDialog bind:this={assetDialog} on:select={select}>
  <svelte:fragment slot="title">Медіа файли</svelte:fragment>
  <svelte:fragment slot="description">Оберіть потрібний файл</svelte:fragment>
</AssetDialog>
