<script lang="ts">
  import { cn } from '$lib/cn'
  import { createDialog, melt } from '@melt-ui/svelte'
  import { createEventDispatcher, setContext } from 'svelte'
  import type { Writable } from 'svelte/store'

  let className = ''
  export { className as class }
  export let open: Writable<boolean> | undefined = undefined

  export function show() {
    $isOpen = true
  }

  export function close() {
    $isOpen = false
  }

  const dispatch = createEventDispatcher()

  const ctx = createDialog({
    open,
    forceVisible: true,
    closeOnOutsideClick: true,
    onOpenChange: ({ next }) => {
      if (next) {
        console.log('here')
        dispatch('open')
      } else {
        dispatch('close')
      }
      return next
    }
  })
  setContext('dialog', ctx)

  const {
    elements: { portalled, overlay, content },
    states: { open: isOpen }
  } = ctx
</script>

<slot name="trigger" />

<div use:melt={$portalled}>
  {#if $isOpen}
    <div
      use:melt={$overlay}
      class="fixed inset-0 flex w-screen justify-center overflow-y-auto bg-zinc-950/25 px-2 py-2 focus:outline-0 sm:px-6 sm:py-8 lg:px-8 lg:py-16"
    />
    <div class="fixed inset-0 w-screen overflow-y-auto pt-6 sm:pt-0">
      <div
        class="grid min-h-full grid-rows-[1fr_auto] justify-items-center sm:grid-rows-[1fr_auto_3fr] sm:p-4"
      >
        <div
          use:melt={$content}
          class={cn(
            'row-start-2 w-full min-w-0 rounded-t-3xl bg-white p-8 shadow-lg ring-1 ring-zinc-950/10 sm:mb-auto sm:max-w-lg sm:rounded-2xl',
            className
          )}
        >
          <slot />
        </div>
      </div>
    </div>
  {/if}
</div>
