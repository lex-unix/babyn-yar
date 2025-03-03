<script lang="ts">
  import { createTooltip, melt } from '@melt-ui/svelte'

  type Placement = 'top' | 'bottom' | 'left' | 'right'

  export let text: string
  export let placement: Placement = 'top'
  export let offest: number = 5

  const {
    elements: { trigger, content, arrow },
    states: { open }
  } = createTooltip({
    positioning: { placement, gutter: offest },
    openDelay: 500,
    closeDelay: 0,
    disableHoverableContent: true,
    closeOnPointerDown: true,
    forceVisible: true
  })
</script>

<slot name="trigger" trigger={$trigger} />

{#if $open}
  <div use:melt={$content} class="z-10 rounded-md bg-white text-sm shadow">
    <div use:melt={$arrow} />
    <p class="px-2.5 py-2 font-medium text-indigo-700">{text}</p>
  </div>
{/if}
