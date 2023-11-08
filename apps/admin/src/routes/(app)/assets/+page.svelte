<script lang="ts">
  import type { Asset, Metadata } from '$lib/types'
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
    Button
  } from '$components'
  import { Trash } from 'lucide-svelte'
  import { fetchAssetsWrapper, deleteAssets } from '$lib'
  import { onMount } from 'svelte'
  import { debounce } from '$lib'
  import { addToast } from '$components/Toaster.svelte'

  let loading = false
  let assets: Asset[] = []
  let metadata: Metadata
  let selectedAssets: number[] = []
  let alertDialog: DeleteAlertDialog
  let isLoadingMore = false

  const fetchAssets = fetchAssetsWrapper()

  onMount(async () => {
    loading = true
    const res = await fetchAssets()
    if (res.ok) {
      assets = res.data.assets
      metadata = res.data.metadata
    }
    loading = false
  })

  async function sort(e: CustomEvent<string>) {
    const res = await fetchAssets({ sort: e.detail })
    if (res.ok) {
      assets = res.data.assets
      metadata = res.data.metadata
    }
  }

  async function search(e: CustomEvent<{ search: string }>) {
    const res = await fetchAssets({ filename: e.detail.search })
    if (res.ok) {
      assets = res.data?.assets
      metadata = res.data.metadata
    }
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

  async function loadMore() {
    isLoadingMore = true
    const { currentPage } = metadata
    const res = await fetchAssets(undefined, currentPage + 1)
    if (res.ok) {
      assets = [...assets, ...res.data.assets]
      metadata = res.data.metadata
    }
    isLoadingMore = false
  }

  async function deleteSelected() {
    const { ok } = await deleteAssets(selectedAssets)
    if (!ok) {
      addToast({
        data: {
          title: 'Щось пішло не так',
          description: 'Спробуйте ще раз',
          variant: 'error'
        }
      })
      return
    }
    selectedAssets = []
    alertDialog.dismiss()
    addToast({
      data: {
        title: 'Операція успішна',
        description: 'Елементи було видалено',
        variant: 'success'
      }
    })
    const res = await fetchAssets()
    if (res.ok) {
      assets = res.data.assets
      metadata = res.data.metadata
    }
  }

  async function onUpload() {
    loading = true
    const res = await fetchAssets()
    if (res.ok) {
      assets = res.data.assets
      metadata = res.data.metadata
    }
    loading = false
  }
</script>

<PageHeader>
  <svelte:fragment slot="heading">Медіа файли</svelte:fragment>
  <UploadAssetsDialog slot="right-items" on:submit={onUpload} />
</PageHeader>

<Container title="Медіа файли">
  <SearchBar on:search={debounce(search)}>
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

  <AssetGrid>
    {#if loading && assets.length === 0}
      <AssetGridItemSkeleton />
      <AssetGridItemSkeleton />
      <AssetGridItemSkeleton />
      <AssetGridItemSkeleton />
      <AssetGridItemSkeleton />
      <AssetGridItemSkeleton />
    {:else}
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
              class="absolute left-2 top-2 z-10 hidden overflow-hidden group-hover:block"
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
    {/if}
  </AssetGrid>
  {#if metadata && metadata.currentPage !== metadata.lastPage}
    <div class="mt-8">
      <div class="flex min-w-full items-center justify-center">
        <Button on:click={loadMore} isLoading={isLoadingMore}>
          Завантажити ще
        </Button>
      </div>
    </div>
  {/if}
</Container>

<DeleteAlertDialog bind:this={alertDialog} on:confirm={deleteSelected} />

<style lang="postcss">
  .selected {
    @apply block;
  }
</style>
