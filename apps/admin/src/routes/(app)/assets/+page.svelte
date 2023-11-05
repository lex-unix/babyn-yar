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
    AssetGrid
  } from '$components'
  import { TrashIcon } from 'lucide-svelte'
  import { fetchAssetsWrapper } from '$lib'
  import { onMount } from 'svelte'
  import { debounce } from '$lib'

  let loading = false
  let assets: Asset[] = []
  let selectedAssets: number[] = []

  const fetchAssets = fetchAssetsWrapper()

  onMount(async () => {
    loading = true
    const res = await fetchAssets()
    assets = res.assets
    loading = false
  })

  async function sort(e: CustomEvent<string>) {
    const res = await fetchAssets({ sort: e.detail })
    assets = res.assets
  }

  async function search(e: CustomEvent<{ search: string }>) {
    const res = await fetchAssets({ filename: e.detail.search })
    assets = res.assets
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
</script>

<PageHeader>
  <svelte:fragment slot="heading">Медіа файли</svelte:fragment>
  <UploadAssetsDialog slot="right-items" />
</PageHeader>

<Container title="Медіа файли">
  <SearchBar on:search={debounce(search)}>
    <AssetSortMenu slot="filters" on:select={sort} />
  </SearchBar>

  {#if selectedAssets.length > 0}
    <div
      class="w-full rounded-md bg-gray-800 text-sm font-normal text-gray-100"
    >
      <div class="px-3 py-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <p>Обрано {selectedAssets.length}</p>
            <button
              on:click={selectAll}
              class="rounded-md px-3 py-2 hover:bg-white/10">Обрати всі</button
            >
            <button
              on:click={clear}
              class="rounded-md px-3 py-2 hover:bg-white/10"
            >
              Очистити
            </button>
          </div>
          <div class="flex items-center justify-center gap-4">
            <button
              class="inline-flex items-center justify-center rounded-md p-2 hover:bg-white/20"
            >
              <TrashIcon size={16} />
            </button>
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
                class="flex h-8 w-8 items-center justify-center rounded-md bg-gray-300 p-3"
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
</Container>

<style lang="postcss">
  .selected {
    @apply block;
  }
</style>
