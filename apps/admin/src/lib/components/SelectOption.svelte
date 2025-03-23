<script lang="ts">
  import { melt, type Select } from '@melt-ui/svelte'
  import { CheckIcon } from 'lucide-svelte'
  import { getContext } from 'svelte'

  export let value: string

  const {
    elements: { option },
    helpers: { isSelected }
  } = getContext<Select<string>>('select')

</script>

<div
  use:melt={$option({ value })}
  class="group/option grid cursor-default grid-cols-[--spacing(5)_1fr] items-baseline gap-x-2 rounded-lg py-2.5 pr-3.5 pl-2 text-base/6 text-zinc-950
  data-[highlighted]:bg-blue-500 data-[highlighted]:text-white sm:grid-cols-[--spacing(4)_1fr] sm:py-1.5 sm:pr-3 sm:pl-1.5 sm:text-sm/6 data-[highlighted]:**:[svg]:text-white"
>
  {#if $isSelected(value)}
    <CheckIcon class="relative size-5 self-center stroke-current sm:size-4" />
  {/if}
  <span
    class="*:[svg]: col-start-2 flex min-w-0 items-center *:[svg]:size-5 *:[svg]:shrink-0 *:[svg]:text-zinc-500
    sm:*:[svg]:size-4"
  >
    <slot name="icon" />
    <span
      class="ml-2.5 truncate first:ml-0 sm:ml-2 sm:first:ml-0"
    >
      <slot />
    </span>
  </span>
</div>
