<script lang="ts">
  import { Tooltip } from '$components'
  import { cn } from '$lib/cn'
  import { melt } from '@melt-ui/svelte'
  import { createEventDispatcher } from 'svelte'

  export let active: boolean = false
  export let tooltip: string

  const dispatch = createEventDispatcher()

  function click() {
    dispatch('click')
  }
</script>

<Tooltip text={tooltip} placement="top" offest={11}>
  <button
    slot="trigger"
    let:trigger
    use:melt={trigger}
    type="button"
    on:click={click}
    class={cn('rounded p-1.5 hover:bg-gray-100', active && 'bg-gray-100')}
    class:active
  >
    <slot />
  </button>
</Tooltip>

<style>
  .active {
    background-color: var(--color-gray-100);
  }
</style>
