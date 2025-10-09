<script lang="ts">
  import { type Snippet } from 'svelte'

  type Props = {
    children: Snippet<[{ tabindex: number }]>
  }

  let { children }: Props = $props()

  let ref: HTMLElement | null = $state(null)

  // Ensure only the first cell's anchor is keyboard-focusable in a row
  // Sets tabindex=0 for the first cell, -1 for subsequent cells
  let tabindex = $derived.by(() => (ref?.previousElementSibling ? -1 : 0))
</script>

<td
  bind:this={ref}
  class="relative border-b border-zinc-950/5 px-4 py-4 first:pl-(--page-padding) last:pr-(--page-padding) last:text-right sm:first:pl-1 sm:last:pr-1"
>
  {@render children({ tabindex })}
</td>
