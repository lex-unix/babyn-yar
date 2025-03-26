<script lang="ts" context="module">
  import type { ToastMessage } from '$lib/toast-messages'

  export type ToastData = ToastMessage['data']

  const {
    elements: { content, title, description, close },
    helpers,
    states: { toasts },
    actions: { portal }
  } = createToaster<ToastData>()

  export const addToast = helpers.addToast
</script>

<script lang="ts">
  import { createToaster, melt } from '@melt-ui/svelte'
  import { flip } from 'svelte/animate'
  import { fly } from 'svelte/transition'
  import { CheckCircle, X, XCircle } from 'lucide-svelte'
</script>

<div
  class="fixed right-0 bottom-0 z-1000 m-4 flex flex-col items-end gap-2"
  use:portal
>
  {#each $toasts as { id, data } (id)}
    <div
      use:melt={$content(id)}
      animate:flip={{ duration: 500 }}
      in:fly={{ duration: 150, x: '100%' }}
      out:fly={{ duration: 150, x: '100%' }}
      class="rounded-xl bg-gray-950 shadow-sm"
    >
      <div
        class="relative w-[24rem] max-w-[calc(100vw-2rem)] px-4 py-5 text-sm/5 text-gray-50"
      >
        <div class="flex items-start gap-3">
          <div>
            <span class="flex h-[1lh] items-center">
              {#if data.variant === 'success'}
                <CheckCircle class="size-5 text-green-500" />
              {:else if data.variant === 'error'}
                <XCircle class="size-5 text-red-500" />
              {/if}
            </span>
          </div>
          <div>
            <div class="mb-1">
              <h3
                use:melt={$title(id)}
                class="flex items-center gap-2 font-semibold"
              >
                {data.title}
              </h3>
            </div>
            <div use:melt={$description(id)} class="">
              <p class="opacity-60">
                {data.description}
              </p>
            </div>
          </div>
        </div>
        <div class="absolute top-4 right-5 grid">
          <button
            use:melt={$close(id)}
            class="inline-flex items-center rounded-full bg-white/0 p-1 opacity-60 transition ease-in-out hover:bg-white/15 hover:opacity-100"
          >
            <X class="size-4" />
          </button>
        </div>
      </div>
    </div>
  {/each}
</div>
