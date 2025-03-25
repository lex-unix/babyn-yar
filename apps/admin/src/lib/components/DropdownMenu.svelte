<script lang="ts">
  import { cn } from '$lib/cn'
  import { melt, type DropdownMenu } from '@melt-ui/svelte'
  import { getContext } from 'svelte'

  let className = ''
  export { className as class }

  const {
    elements: { menu },
    states: { open }
  } = getContext<DropdownMenu>('dropdown')
</script>

{#if $open}
  <div
    use:melt={$menu}
    class={cn(
      'isolate grid grid-cols-[auto_1fr] overflow-y-auto rounded-xl bg-white/75 p-1 shadow-lg ring-1 ring-zinc-950/10 outline outline-transparent backdrop-blur-xl focus:outline-hidden',
      className
    )}
  >
    <slot />
  </div>
{/if}
