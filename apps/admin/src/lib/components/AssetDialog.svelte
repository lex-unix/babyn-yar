<script lang="ts">
  import { fetchAssets } from '$lib/assets'
  import { createDialog, melt } from '@melt-ui/svelte'
  import { X } from 'lucide-svelte'
  import { createEventDispatcher } from 'svelte'
  import SearchBar from './SearchBar.svelte'
  import type { Asset } from '$lib/types'

  export function openDialog() {
    open.set(true)
  }

  export function closeDialog() {
    open.set(false)
  }

  let searchValue = ''
  let assetsPromise: Promise<Asset[]>
  let timeoutId: ReturnType<typeof setTimeout>

  $: {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      assetsPromise = fetchAssets({ filename: searchValue })
    }, 1000)
  }

  const dispatch = createEventDispatcher<{ select: { url: string } }>()

  function selectAsset(url: string) {
    dispatch('select', {
      url
    })
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
    <div
      class="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden p-10"
      use:melt={$content}
    >
      <div class="relative h-full rounded-xl bg-gray-50 p-6 shadow-xl">
        <h2 use:melt={$title} class="m-0 text-xl font-semibold text-gray-900">
          Медіа файли
        </h2>
        <p
          use:melt={$description}
          class="mb-5 mt-2 leading-normal text-gray-500"
        >
          Оберіть потрібний файл
        </p>
        <div class="mb-10">
          <SearchBar bind:value={searchValue} />
        </div>

        <ul class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          {#await assetsPromise then assets}
            {#each assets as asset}
              <li class="p-2.5">
                <button
                  class="group relative w-full"
                  on:click={() => selectAsset(asset.url)}
                >
                  <div
                    class="h-[140px] max-h-[140px] w-full min-w-[220px] overflow-x-hidden rounded-lg bg-gray-200"
                  >
                    <div class="h-full w-full">
                      <div
                        class="flex h-[140px] items-center justify-center text-gray-500"
                      >
                        <img
                          src={asset.url}
                          alt={asset.fileName}
                          class="max-h-full max-w-full"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    class="absolute left-0 top-0 z-10 m-2 hidden rounded bg-gray-200 p-1.5 group-hover:block"
                  />
                  <div class="mt-2 w-full">
                    <p class="line-clamp-1 text-sm text-gray-500">
                      {asset.fileName}
                    </p>
                  </div>
                </button>
              </li>
            {/each}
          {/await}
        </ul>

        <button
          use:melt={$close}
          aria-label="close"
          class="text-magnum-800 hover:bg-magnum-100 focus:shadow-magnum-400 absolute right-4 top-4 inline-flex h-6 w-6 appearance-none items-center justify-center rounded-full p-1"
        >
          <X class="square-4" />
        </button>
      </div>
    </div>
  {/if}
</div>