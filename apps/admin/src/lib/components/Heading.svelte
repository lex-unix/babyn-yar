<script lang="ts">
  import type { Snippet } from 'svelte'

  type Props = {
    children: Snippet
  }

  let { children }: Props = $props()
</script>

<h1 class="text-2xl/8 font-semibold text-zinc-950 sm:text-xl/8">
  {@render children()}
</h1>
