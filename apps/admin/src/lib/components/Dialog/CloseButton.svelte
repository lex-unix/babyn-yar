<script lang="ts">
  import { type Dialog, melt } from '@melt-ui/svelte'
  import { XIcon } from 'lucide-svelte'
  import { getContext } from 'svelte'
  import type { Size } from './Dialog.svelte'
  import { cn } from '$lib/cn'

  export let isDisabled = false

  const {
    elements: { close }
  } = getContext<Dialog>('dialog')
  const size = getContext<Size>('size')
</script>

<button
  use:melt={$close}
  aria-label="Закрити"
  disabled={isDisabled}
  class={cn(
    'absolute inline-flex items-center justify-center rounded-full p-1.5 text-gray-800 outline-none hover:bg-gray-100 focus:ring focus:ring-indigo-300 disabled:opacity-60',
    size === 'lg' && 'lg-top-9 right-5 top-5 lg:right-9',
    size === 'md' && 'right-5 top-5 lg:right-9 lg:top-9',
    size === 'sm' && 'right-3 top-3 md:right-6 md:top-6'
  )}
>
  <XIcon class="h-4 w-4" />
</button>
