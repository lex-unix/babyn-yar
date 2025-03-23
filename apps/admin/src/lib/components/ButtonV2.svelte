<script lang="ts">
  import { useActions, type ActionArray } from '$lib/actions'
  import { cn } from '$lib/cn'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface $$Props extends HTMLButtonAttributes {
    use?: ActionArray
    class?: string
    plain?: boolean
  }

  export let use: ActionArray = []
  export let plain = false
  let className = ''
  export { className as class }
</script>

<span class="relative">
  <button
    use:useActions={use}
    class={cn(
      `relative isolate inline-flex items-baseline justify-center gap-x-2 rounded-lg border border-transparent px-3.5 py-2.5 text-base/6 font-semibold text-white
      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:px-3 sm:py-1.5 sm:text-sm/6
      *:[svg]:-mx-0.5 *:[svg]:my-0.5 *:[svg]:size-5 *:[svg]:shrink-0 *:[svg]:self-center sm:*:[svg]:my-1 sm:*:[svg]:size-4`,
      !plain &&
        'bg-zinc-950/90 before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-zinc-900 before:shadow-sm after:absolute after:inset-0 after:-z-10 after:rounded-lg hover:after:bg-white/10 *:[svg]:text-zinc-400 hover:*:[svg]:text-zinc-300',
      plain &&
        'hover:bg-zinc-950/5 *:[svg]:text-zinc-500 hover:*:[svg]:text-zinc-700',
      className
    )}
    {...$$restProps}
  >
    <slot name="icon" />

    {#if $$slots.default}
      <span class="truncate">
        <slot />
      </span>
    {/if}
  </button>
</span>
