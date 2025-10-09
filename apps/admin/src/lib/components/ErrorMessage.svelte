<script lang="ts">
  import type { Snippet } from 'svelte'
  import Warning from 'phosphor-svelte/lib/Warning'

  type Props = {
    children: Snippet
  }

  let { children }: Props = $props()
</script>

<div class="my-4">
  <div
    class="flex gap-3 rounded border border-red-700/10 bg-red-100 px-4 py-2.5 text-red-800"
  >
    <Warning />
    <span>
      {@render children()}
    </span>
  </div>
</div>
