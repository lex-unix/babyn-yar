<script lang="ts">
  import type { Asset } from '$lib/types'
  import {
    AssetGridItemSkeleton,
    UploadAssetsDialog,
    SearchBar,
    AssetSortMenu,
    AssetItem,
    PageHeader,
    Container,
    AssetGrid,
    DeleteAlertDialog,
    Button,
    EmptySearchMessage
  } from '$components'
  import { RefreshCcw, Trash } from 'lucide-svelte'
  import { addToast } from '$components/Toaster.svelte'
  import { deleteErrorMsg, deleteSuccessMsg } from '$lib/toast-messages'
  import { writable } from 'svelte/store'
  import { createAssetsQuery, createDeleteAssetsMutation } from '$query/assets'

  let assets: Asset[] = []
  let selectedAssets: number[] = []
  let alertDialog: DeleteAlertDialog

  const filters = writable({
    search: '',
    sort: ''
  })

  const query = createAssetsQuery(filters)
  const mutation = createDeleteAssetsMutation()

  function sort(e: CustomEvent<string>) {
    $filters.sort = e.detail
  }

  function search(e: CustomEvent<{ search: string }>) {
    $filters.search = e.detail.search
  }

  function clear() {
    selectedAssets = []
  }

  function selectAll() {
    selectedAssets = assets.map(asset => asset.id)
  }

  function toggleSelect(id: number) {
    if (selectedAssets.includes(id)) {
      selectedAssets = selectedAssets.filter(a => a !== id)
    } else {
      selectedAssets = [...selectedAssets, id]
    }
  }

  function deleteSelected() {
    $mutation.mutate(selectedAssets, {
      onSuccess: () => {
        selectedAssets = []
        addToast(deleteSuccessMsg)
      },
      onError: () => {
        addToast(deleteErrorMsg)
      }
    })
    alertDialog.dismiss()
  }
</script>

<PageHeader>
  <svelte:fragment slot="heading">Медіа файли</svelte:fragment>
  <UploadAssetsDialog slot="right-items" />
</PageHeader>

<Container title="Медіа файли">
  <SearchBar on:search={search} debounceWait={200}>
    <AssetSortMenu slot="filters" on:select={sort} />
  </SearchBar>

  {#if selectedAssets.length > 0}
    <div class="my-5">
      <div
        class="w-full rounded-md bg-gray-100 text-sm font-normal text-gray-700"
      >
        <div class="px-3 py-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <p>Обрано {selectedAssets.length}</p>
              <button
                on:click={selectAll}
                class="rounded-md px-3 py-2 hover:bg-gray-200"
              >
                Обрати всі
              </button>
              <button
                on:click={clear}
                class="rounded-md px-3 py-2 hover:bg-gray-200"
              >
                Очистити
              </button>
            </div>
            <div class="flex items-center justify-center gap-4">
              <button
                on:click={() => alertDialog.show()}
                class="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-200"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}

  {#if $query.isLoading}
    <AssetGrid>
      <AssetGridItemSkeleton count={50} />
    </AssetGrid>
  {:else if $query.isSuccess && $query.data.pages[0].assets.length === 0}
    <div class="mt-10">
      <EmptySearchMessage />
    </div>
  {:else if $query.isError}
    <div class="mt-6 text-center text-red-700">
      <p>Сталася помилка при завантажені</p>
      <p class="font-mono text-sm">{$query.error.message}</p>
    </div>
  {:else if $query.isSuccess}
    <AssetGrid>
      {#each $query.data.pages as { assets }}
        {#each assets as asset}
          {@const selected = selectedAssets.includes(asset.id)}
          <li class="p-2.5">
            <div class="group relative">
              <AssetItem
                src={asset.url}
                fileName={asset.fileName}
                contentType={asset.contentType}
              />
              <div
                class="absolute left-2 top-2 z-[2] hidden overflow-hidden group-hover:block"
                class:selected
              >
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-md bg-gray-200 p-3"
                >
                  <input
                    id="id-{asset.id}"
                    type="checkbox"
                    checked={selected}
                    on:change={() => toggleSelect(asset.id)}
                  />
                </div>
              </div>
            </div>
          </li>
        {/each}
      {/each}
    </AssetGrid>
    {#if $query.hasNextPage}
      <div class="mt-8">
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
</Container>

<DeleteAlertDialog bind:this={alertDialog} on:confirm={deleteSelected} />

<style lang="postcss">
  .selected {
    @apply block;
  }
</style>
