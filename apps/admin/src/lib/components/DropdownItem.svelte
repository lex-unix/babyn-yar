<script lang="ts">
  import { DropdownMenu } from 'bits-ui'
  import type { Snippet } from 'svelte'

  type Props = {
    onSelect?: VoidFunction
    children: Snippet
    icon?: Snippet
  }

  const { onSelect, children, icon }: Props = $props()
</script>

<DropdownMenu.Item
  {onSelect}
  class="col-span-full grid cursor-default grid-cols-subgrid items-center rounded-lg px-3.5 py-2.5 text-left text-base/6 text-zinc-950 focus:outline-hidden data-[highlighted]:bg-blue-500 data-[highlighted]:text-white *:data-[slot=icon]:col-start-1 *:data-[slot=icon]:row-start-1 *:data-[slot=icon]:mr-2.5 *:data-[slot=icon]:-ml-0.5 *:data-[slot=icon]:size-5 *:data-[slot=icon]:fill-zinc-500 data-[highlighted]:*:data-[slot=icon]:fill-white sm:px-3 sm:py-1.5 sm:text-sm/6 sm:*:data-[slot=icon]:mr-2 sm:*:data-[slot=icon]:size-4"
>
  {@render icon?.()}
  {#if children}
    <span class="col-start-2">
      {@render children()}
    </span>
  {/if}
</DropdownMenu.Item>
