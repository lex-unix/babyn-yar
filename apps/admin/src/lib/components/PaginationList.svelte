<script lang="ts">
  import type { Snippet } from 'svelte'

  type Props = {
    children: Snippet
  }

  let { children }: Props = $props()
</script>

<span class="hidden items-baseline gap-x-2 sm:flex">
  {@render children()}
</span>
