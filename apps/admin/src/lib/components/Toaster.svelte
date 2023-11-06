<script lang="ts" context="module">
  export type ToastData = {
    title: string
    description: string
    variant: 'success' | 'error'
  }

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
  import { X } from 'lucide-svelte'
</script>

<div
  class="fixed bottom-0 right-0 z-[1000] m-4 flex flex-col items-end gap-2"
  use:portal
>
  {#each $toasts as { id, data } (id)}
    <div
      use:melt={$content(id)}
      animate:flip={{ duration: 500 }}
      in:fly={{ duration: 150, x: '100%' }}
      out:fly={{ duration: 150, x: '100%' }}
      class="rounded-lg bg-neutral-700 text-white shadow-md"
      class:success={data.variant === 'success'}
      class:error={data.variant === 'error'}
    >
      <div
        class="relative flex w-[24rem] max-w-[calc(100vw-2rem)] items-center justify-between gap-4 p-5"
      >
        <div>
          <h3
            use:melt={$title(id)}
            class="flex items-center gap-2 font-semibold"
          >
            {data.title}
            <span class="square-1.5 rounded-full" />
          </h3>
          <div use:melt={$description(id)}>
            {data.description}
          </div>
        </div>
        <button
          use:melt={$close(id)}
          class="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </div>
  {/each}
</div>

<style lang="postcss">
  .success {
    @apply bg-green-100 text-green-800 shadow-green-200;
  }

  .error {
    @apply bg-red-100 text-red-800 shadow-red-300;
  }
</style>
