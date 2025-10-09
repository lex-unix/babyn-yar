<script lang="ts">
  import type { Snippet } from 'svelte'

  type Props = {
    children: Snippet
  }

  let { children }: Props = $props()
</script>

<p
  class="dark text-base/6 text-zinc-500 data-disabled:opacity-50 sm:text-sm/6"
  data-slot="description"
>
  {@render children()}
</p>
