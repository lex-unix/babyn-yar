<script lang="ts">
  import { PlusIcon, XIcon } from 'lucide-svelte'
  import { AssetDialog } from '$components'

  export let documents: Array<{ url: string; fileName: string }>

  let assetDialog: AssetDialog

  function select(e: CustomEvent<{ url: string; fileName: string }>) {
    documents = [...documents, e.detail]
    assetDialog.closeDialog()
  }

  function remove(i: number) {
    documents = documents.filter((_, index) => index !== i)
  }
</script>

<div>
  <label for="select-docs" class="mb-1.5 block text-gray-400">Долучення</label>

  <div
    class="flex w-full flex-wrap items-center border bg-white px-3 py-2 text-sm"
  >
    {#each documents as doc, i}
      <div class="m-1">
        <div
          class="flex items-center gap-2 rounded bg-orange-100 px-2 py-1 text-orange-900"
        >
          <span>{doc.fileName}</span>
          <button
            type="button"
            on:click={() => remove(i)}
            aria-label="Видалити долучення"
          >
            <XIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    {/each}
    <button
      type="button"
      id="select-docs"
      class="flex items-center gap-1 text-sm text-gray-700"
      on:click={() => assetDialog.openDialog('')}
    >
      <PlusIcon class="h-4 w-4" />
      <span>Додати</span>
    </button>
  </div>
</div>

<AssetDialog bind:this={assetDialog} on:select={select}>
  <svelte:fragment slot="title">Медіа файли</svelte:fragment>
  <svelte:fragment slot="description">Оберіть потрібний файл</svelte:fragment>
</AssetDialog>
