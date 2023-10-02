<script lang="ts">
  import type { Asset } from '$lib/types'
  import {
    AssetGridItem,
    AssetGridItemSkeleton,
    UploadAssetsDialog
  } from '$components'
  import { TrashIcon } from 'lucide-svelte'

  let assets: Asset[] = []
  let selected: string[] = []
  let assetDialog: UploadAssetsDialog

  function clear() {
    selected = []
  }

  function selectAll() {
    selected = assets.map(asset => asset.id.toString())
  }

  const assetsPromise: Promise<Asset[]> = fetch(
    'http://localhost:8000/v1/assets'
  )
    .then(res => res.json())
    .then(json => json.assets)

  $: console.log(selected)
</script>

<div class="flex items-center justify-between">
  <h1 class="text-2xl font-semibold">Медіа файли</h1>
  <UploadAssetsDialog bind:this={assetDialog} />
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
  {#await assetsPromise}
    <AssetGridItemSkeleton />
    <AssetGridItemSkeleton />
    <AssetGridItemSkeleton />
    <AssetGridItemSkeleton />
    <AssetGridItemSkeleton />
    <AssetGridItemSkeleton />
  {:then assets}
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
  {/await}
</ul>
