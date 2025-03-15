<script lang="ts">
  import { type Dialog, melt } from '@melt-ui/svelte'
  import { getContext } from 'svelte'
  import type { Size } from './Dialog.svelte'
  import { cn } from '$lib/cn'

  let ref: HTMLElement

  const {
    elements: { portalled, content, overlay },
    states: { open }
  } = getContext<Dialog>('dialog')

  const size = getContext<Size>('size')
</script>

<div use:melt={$portalled}>
  {#if $open}
    <div
      use:melt={$overlay}
      class="fixed inset-0 bg-black/10 backdrop-blur-sm"
    />
    <div
      class="fixed inset-0 flex w-full min-w-full shrink-0 items-center justify-center overflow-y-auto overflow-x-hidden p-2 md:p-6"
    >
      <div
        bind:this={ref}
        use:melt={$content}
        class={cn(
          'relative overflow-hidden rounded-lg bg-white shadow-[0_16px_20px_hsla(0,0%,0%,20%)]',
          size === 'sm' && 'w-[90vw] max-w-md p-3 md:p-6',
          size === 'md' &&
            'w-full p-5 lg:min-w-[720px] lg:max-w-[800px] lg:p-9',
          size === 'lg' && 'h-full w-full p-5 md:p-9'
        )}
      >
        <div class="mb-5">
          <div class="mb-2">
            <slot name="title" />
          </div>
          <slot name="description" />
        </div>
        <slot {ref} />
      </div>
    </div>
  {/if}
</div>
