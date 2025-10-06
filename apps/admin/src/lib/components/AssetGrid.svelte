<script lang="ts">
  import type { Snippet } from 'svelte'

  type Props = {
    children: Snippet
  }

  let { children }: Props = $props()
</script>

<ul
  class="grid auto-rows-[148px] grid-cols-[repeat(auto-fill,minmax(166px,1fr))] justify-center gap-3 lg:auto-rows-[200px] lg:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] lg:justify-normal"
>
  {@render children()}
</ul>
