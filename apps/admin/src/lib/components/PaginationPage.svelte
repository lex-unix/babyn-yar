<script lang="ts">
  import { cn } from '$lib/cn'

  export let active = false
</script>

<button
  on:click
  data-active={active || undefined}
  class={cn(
    'relative isolate inline-flex min-w-[2.25rem] items-baseline justify-center gap-x-2 rounded-lg border border-transparent px-3.5 py-2.5 text-base/6 font-semibold text-zinc-950 before:absolute before:-inset-px before:rounded-lg hover:bg-zinc-950/5  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 data-active:bg-zinc-950/5 sm:px-3 sm:py-1.5 sm:text-sm/6'
  )}
>
  <span class="-mx-0.5">
    <slot />
  </span>
</button>
