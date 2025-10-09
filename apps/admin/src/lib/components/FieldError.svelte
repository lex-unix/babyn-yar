<script lang="ts">
  import type { Snippet } from 'svelte'

  type Props = {
    children: Snippet
  }

  let { children }: Props = $props()
</script>

<p
  class="text-base/6 text-red-600 first-letter:uppercase sm:text-sm/6"
  data-slot="error"
>
  {@render children()}
</p>
