<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    children: Snippet
  }

  let { children }: Props = $props()
</script>

<span class="ml-2.5 truncate first:ml-0 sm:ml-2 sm:first:ml-0">
  {@render children()}
</span>
