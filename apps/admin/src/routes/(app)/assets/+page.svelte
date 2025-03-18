<script lang="ts">
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
    EmptySearchMessage
  } from '$components'
  import { Trash } from 'lucide-svelte'
  import { useAssets, useDeleteAssets } from '$lib/assets/query'
  import { infiniteScroll } from '$lib/actions'
  import { scrollContainer } from '$lib/stores'
  import { cn } from '$lib/cn'
  import { updateFilter } from '$lib/url-params'
  import { page } from '$app/stores'

  let selectedAssets: number[] = []
  let alertDialog: DeleteAlertDialog

  const assets = useAssets()
  const deleteAssets = useDeleteAssets()

  function clear() {
    selectedAssets = []
  }

  function selectAll() {
    if ($assets.isSuccess) {
      selectedAssets = $assets.data.pages
        .flatMap(p => p.assets || [])
        .map(asset => asset.id)
    }
  }

  function toggleSelect(id: number) {
    if (selectedAssets.includes(id)) {
      selectedAssets = selectedAssets.filter(a => a !== id)
    } else {
      selectedAssets = [...selectedAssets, id]
    }
  }

  function deleteSelected() {
    $deleteAssets.mutate(selectedAssets, {
      onSuccess: () => {
        selectedAssets = []
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
  <SearchBar
    on:search={e => updateFilter('filename', e.detail.search)}
    debounceWait={200}
    defaultValue={$page.url.searchParams.get('filename') || ''}
  >
    <AssetSortMenu
      slot="filters"
      on:select={e => updateFilter('sort', e.detail)}
    />
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

  {#if $assets.isLoading}
    <AssetGrid>
      <AssetGridItemSkeleton count={50} />
    </AssetGrid>
  {:else if $assets.isSuccess && $assets.data.pages[0].assets.length === 0}
    <div class="mt-10">
      <EmptySearchMessage />
    </div>
  {:else if $assets.isError}
    <div class="mt-6 text-center text-red-700">
      <p>Сталася помилка при завантажені</p>
      <p class="font-mono text-sm">{$assets.error.message}</p>
    </div>
  {:else if $assets.isSuccess}
    <AssetGrid>
      {#each $assets.data.pages as { assets }}
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
                class={cn(
                  'absolute left-2 top-2 z-[2] hidden overflow-hidden group-hover:block',
                  selected && 'block'
                )}
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
    {#if $assets.hasNextPage && !$assets.isFetching}
      <div
        use:infiniteScroll={{
          onIntersect: $assets.fetchNextPage,
          root: $scrollContainer
        }}
      />
    {/if}
  {/if}
</Container>

<DeleteAlertDialog bind:this={alertDialog} on:confirm={deleteSelected} />
