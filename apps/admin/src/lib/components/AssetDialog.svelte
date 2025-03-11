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
    AssetItem,
    AssetGridItemSkeleton
  } from '$components'
  import { useAssets } from '$query/assets'
  import type { Asset } from '$lib/types'
  import { createEventDispatcher } from 'svelte'
  import { writable } from 'svelte/store'
  import { infiniteScroll } from '$lib/actions'

  export function open(type: string) {
    dialog.show()
    $filters.contentType = type
  }

  export function close() {
    dialog.dissmis()
  }

  let dialog: Dialog

  let filters = writable({
    sort: '',
    search: '',
    contentType: ''
  })

  const assets = useAssets(filters)
  const dispatch = createEventDispatcher()

  async function sort(e: CustomEvent<string>) {
    $filters.sort = e.detail
  }

  async function search(e: CustomEvent<{ search: string }>) {
    $filters.search = e.detail.search
  }

  function selectAsset(asset: Asset) {
    let type = ''
    if (asset.contentType.startsWith('image')) {
      type = 'image'
    } else if (asset.contentType.startsWith('video')) {
      type = 'video'
    }
    dispatch('select', {
      type,
      id: asset.id,
      url: asset.url,
      fileName: asset.fileName
    })
  }
</script>

<Dialog bind:this={dialog} size="lg">
  <DialogContent let:ref>
    <DialogTitle slot="title">Медіа файли</DialogTitle>
    <DialogDescription slot="description">
      Оберіть потрібний файл
    </DialogDescription>
    <div class="mb-5">
      <SearchBar on:search={search}>
        <AssetSortMenu slot="filters" on:select={sort} />
      </SearchBar>
    </div>
    <div class="h-[85%] overflow-y-auto pb-20 pr-3">
      {#if $assets.isLoading}
        <AssetGrid>
          <AssetGridItemSkeleton count={50} />
        </AssetGrid>
      {:else if $assets.isError}
        <div class="mt-6 text-center font-medium text-red-700">
          <p class="pb-4">Сталася помилка при завантажені</p>
          <p class="font-mono text-sm">{$assets.error.message}</p>
        </div>
      {:else if $assets.isSuccess && $assets.data.pages[0].assets.length === 0}
        <div
          class="col-span-full flex h-full w-full flex-col items-center justify-center"
        >
          <p class="text-center text-lg font-medium text-gray-500">
            Вибачте, ми не змогли знайти жодного файлу за вашими критеріями
          </p>
        </div>
      {:else if $assets.isSuccess}
        <AssetGrid>
          {#each $assets.data.pages as { assets }}
            {#each assets as asset}
              <li class="p-2.5">
                <button
                  class="group relative w-full"
                  on:click={() => selectAsset(asset)}
                >
                  <AssetItem
                    src={asset.url}
                    fileName={asset.fileName}
                    contentType={asset.contentType}
                  />
                </button>
              </li>
            {/each}
          {/each}
        </AssetGrid>
        {#if $assets.hasNextPage && !$assets.isFetching}
          <div
            use:infiniteScroll={{
              onIntersect: $assets.fetchNextPage,
              root: ref
            }}
          />
        {/if}
      {/if}
    </div>
    <DialogClose />
  </DialogContent>
</Dialog>
