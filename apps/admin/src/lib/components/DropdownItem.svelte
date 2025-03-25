<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte'
  import { type DropdownMenu, melt } from '@melt-ui/svelte'
  import { cn } from '$lib/cn'

  let className: string = ''
  export { className as class }

  const dispatch = createEventDispatcher()

  function select() {
    dispatch('select')
  }

  const {
    elements: { item }
  } = getContext<DropdownMenu>('dropdown')
</script>

<div
  use:melt={$item}
  on:m-click={select}
  class={cn(
    'col-span-full grid cursor-default grid-cols-subgrid items-center rounded-lg px-3.5 py-2.5 text-left text-base/6 text-zinc-950 focus:outline-hidden data-[highlighted]:bg-blue-500 data-[highlighted]:text-white sm:px-3 sm:py-1.5 sm:text-sm/6 *:[svg]:col-start-1 *:[svg]:row-start-1 *:[svg]:mr-2.5 *:[svg]:-ml-0.5 *:[svg]:size-5 *:[svg]:text-zinc-500 data-[highlighted]:*:[svg]:text-white sm:*:[svg]:mr-2 sm:*:[svg]:size-4',
    className
  )}
>
  <slot name="icon" />
  {#if $$slots.default}
    <span class="col-start-2">
      <slot />
    </span>
  {/if}
</div>
