<script lang="ts">
  import {
    Dialog,
    DialogTitle,
    DialogDescription,
    DialogContent,
    DialogClose,
    SearchBar,
    AssetGrid,
    AssetSortMenu,
    AssetItem
  } from '$components'
  import { fetchAssetsWrapper } from '$lib'
  import type { Asset } from '$lib/types'
  import { createEventDispatcher } from 'svelte'

  export async function open(type: string) {
    isLoading = true
    dialog.show()
    const res = await fetchAssets({ contentType: type })
    assets = res.assets
    contentType = type
    isLoading = false
  }

  export function close() {
    dialog.dissmis()
  }

  let assets: Asset[] = []
  let contentType: string
  let dialog: Dialog
  let isLoading = false

  const fetchAssets = fetchAssetsWrapper()
  const dispatch = createEventDispatcher<{
    select: { url: string; type: string; fileName: string }
  }>()

  async function sort(e: CustomEvent<string>) {
    const res = await fetchAssets({ sort: e.detail })
    assets = res.assets
  }

  async function search(e: CustomEvent<{ search: string }>) {
    const res = await fetchAssets({ contentType, filename: e.detail.search })
    assets = res.assets
  }

  function selectAsset(url: string, contentType: string, fileName: string) {
    let type = ''
    if (contentType.startsWith('image')) {
      type = 'image'
    } else if (contentType.startsWith('video')) {
      type = 'video'
    }
    dispatch('select', { url, type, fileName })
  }
</script>

<Dialog bind:this={dialog} size="lg">
  <DialogContent>
    <DialogTitle slot="title">Медіа файли</DialogTitle>
    <DialogDescription slot="description">
      Оберіть потрібний файл
    </DialogDescription>
    <div class="mb-5">
      <SearchBar on:search={search}>
        <AssetSortMenu slot="filters" on:select={sort} />
      </SearchBar>
    </div>
    <AssetGrid>
      {#each assets as asset}
        <li class="p-2.5">
          <button
            class="group relative w-full"
            on:click={() =>
              selectAsset(asset.url, asset.contentType, asset.fileName)}
          >
            <AssetItem
              src={asset.url}
              fileName={asset.fileName}
              contentType={asset.contentType}
            />
          </button>
        </li>
      {:else}
        {#if !isLoading}
          <div
            class="flex flex-col justify-center items-center h-full col-span-full w-full"
          >
            <p class="text-gray-500 font-medium text-center text-lg">
              Вибачте, ми не змогли знайти жодного файлу за вашими критеріями
            </p>
          </div>
        {/if}
      {/each}
    </AssetGrid>
    <DialogClose />
  </DialogContent>
</Dialog>
