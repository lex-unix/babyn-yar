<script lang="ts">
  import type { Asset } from '$lib/types'
  import {
    AssetGridItem,
    AssetGridItemSkeleton,
    UploadAssetsDialog,
    SearchBar,
    AssetSortMenu
  } from '$components'
  import { TrashIcon } from 'lucide-svelte'
  import { fetchAssetsWrapper } from '$lib'
  import { onMount } from 'svelte'

  let loading = false
  let assets: Asset[] = []
  let selected: string[] = []
  let assetDialog: UploadAssetsDialog
  let timeoutId: ReturnType<typeof setTimeout>

  const fetchAssets = fetchAssetsWrapper()

  onMount(async () => {
    loading = true
    const res = await fetchAssets()
    assets = res.assets
    loading = false
  })

  function clear() {
    selected = []
  }

  async function sort(e: CustomEvent<string>) {
    const res = await fetchAssets({ sort: e.detail })
    assets = res.assets
  }

  function search(e: CustomEvent<{ search: string }>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(async () => {
      const res = await fetchAssets({ filename: e.detail.search })
      assets = res.assets
    }, 500)
  }

  function selectAll() {
    selected = assets.map(asset => asset.id.toString())
  }
</script>

<div class="flex items-center justify-between">
  <h1 class="text-2xl font-semibold">Медіа файли</h1>
  <UploadAssetsDialog bind:this={assetDialog} />
</div>

<div class="mb-10 mt-6">
  <SearchBar on:search={search}>
    <svelte:fragment slot="filters">
      <AssetSortMenu on:select={sort} />
    </svelte:fragment>
  </SearchBar>
</div>

{#if selected.length > 0}
  <div class="w-full rounded bg-slate-800 font-normal text-gray-100">
    <div class="px-5 py-3">
      <div class="flex items-center justify-center gap-4">
        <p>Обрано {selected.length}</p>
        <button
          on:click={selectAll}
          class="rounded-md px-3 py-2 hover:bg-white/10">Обрати всі</button
        >
        <button on:click={clear} class="rounded-md px-3 py-2 hover:bg-white/10">
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
{/if}

<ul class="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
  {#if loading && assets.length === 0}
    <AssetGridItemSkeleton />
    <AssetGridItemSkeleton />
    <AssetGridItemSkeleton />
    <AssetGridItemSkeleton />
    <AssetGridItemSkeleton />
    <AssetGridItemSkeleton />
  {:else}
    {#each assets as asset}
      <AssetGridItem
        src={asset.url}
        id={asset.id}
        fileName={asset.fileName}
        alt={asset.fileName}
        contentType={asset.contentType}
        bind:selected
      />
    {/each}
  {/if}
</ul>
