<script lang="ts">
  import { SearchBar, AssetSortMenu, AssetItem, AssetGrid } from '$components'
  import { fetchAssetsWrapper } from '$lib'
  import type { Asset } from '$lib/types'
  import { createDialog, melt } from '@melt-ui/svelte'
  import { X } from 'lucide-svelte'
  import { createEventDispatcher } from 'svelte'

  const fetchAssets = fetchAssetsWrapper()

  export async function openDialog(type: string) {
    open.set(true)
    const res = await fetchAssets({ contentType: type })
    assets = res.assets
    contentType = type
  }

  export function closeDialog() {
    open.set(false)
  }

  async function sort(e: CustomEvent<string>) {
    const res = await fetchAssets({ sort: e.detail })
    assets = res.assets
  }

  let assets: Asset[] = []
  let timeoutId: ReturnType<typeof setTimeout>
  let contentType: string

  async function search(e: CustomEvent<{ search: string }>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(async () => {
      const res = await fetchAssets({ contentType, filename: e.detail.search })
      assets = res.assets
    }, 1000)
  }

  const dispatch = createEventDispatcher<{
    select: { url: string; type: string; fileName: string }
  }>()

  function selectAsset(url: string, contentType: string, fileName: string) {
    let type = ''
    if (contentType.startsWith('image')) {
      type = 'image'
    } else if (contentType.startsWith('video')) {
      type = 'video'
    }
    dispatch('select', { url, type, fileName })
  }

  const {
    elements: { overlay, content, title, description, close, portalled },
    states: { open }
  } = createDialog({
    forceVisible: true,
    closeOnOutsideClick: true
  })
</script>

<div use:melt={$portalled}>
  {#if $open}
    <div use:melt={$overlay} class="fixed inset-0 z-50 bg-black/50" />
    <div class="fixed inset-0 z-50 md:p-10">
      <div
        use:melt={$content}
        class="relative h-full overflow-y-auto overflow-x-hidden bg-gray-50 p-5 shadow-xl md:rounded-xl md:p-9"
      >
        <h2 use:melt={$title} class="m-0 text-xl font-semibold text-gray-900">
          <slot name="title" />
        </h2>
        <p
          use:melt={$description}
          class="mb-5 mt-2 leading-normal text-gray-500"
        >
          <slot name="description" />
        </p>
        <div class="mb-10">
          <SearchBar on:search={search}>
            <svelte:fragment slot="filters">
              <AssetSortMenu on:select={sort} />
            </svelte:fragment>
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
          {/each}
        </AssetGrid>
        <button
          use:melt={$close}
          aria-label="close"
          class="absolute right-9 top-9 inline-flex h-7 w-7 appearance-none items-center justify-center rounded-full p-1 text-gray-800 outline-none hover:bg-gray-100 focus:ring focus:ring-teal-300"
        >
          <X class="square-4" />
        </button>
      </div>
    </div>
  {/if}
</div>
