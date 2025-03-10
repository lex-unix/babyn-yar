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
    Button,
    AssetGridItemSkeleton
  } from '$components'
  import { createAssetsQuery } from '$lib/query'
  import type { Asset } from '$lib/types'
  import { createEventDispatcher } from 'svelte'
  import { RefreshCcw } from 'lucide-svelte'
  import { writable } from 'svelte/store'

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

  const query = createAssetsQuery(filters)
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
    <div class="h-[85%] overflow-y-auto pb-20 pr-3">
      {#if $query.isLoading}
        <AssetGrid>
          <AssetGridItemSkeleton count={50} />
        </AssetGrid>
      {:else if $query.isError}
        <div class="mt-6 text-center font-medium text-red-700">
          <p class="pb-4">Сталася помилка при завантажені</p>
          <p class="font-mono text-sm">{$query.error.message}</p>
        </div>
      {:else if $query.isSuccess && $query.data.pages[0].assets.length === 0}
        <div
          class="col-span-full flex h-full w-full flex-col items-center justify-center"
        >
          <p class="text-center text-lg font-medium text-gray-500">
            Вибачте, ми не змогли знайти жодного файлу за вашими критеріями
          </p>
        </div>
      {:else if $query.isSuccess}
        <AssetGrid>
          {#each $query.data.pages as { assets }}
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
        {#if $query.hasNextPage}
          <div class="pt-8">
            <div class="flex min-w-full items-center justify-center">
              <Button
                on:click={() => $query.fetchNextPage()}
                isLoading={$query.isFetchingNextPage}
                variant="soft"
              >
                <RefreshCcw slot="icon" class="h-4 w-4" />
                Показати ще
              </Button>
            </div>
          </div>
        {/if}
      {/if}
    </div>
    <DialogClose />
  </DialogContent>
</Dialog>
