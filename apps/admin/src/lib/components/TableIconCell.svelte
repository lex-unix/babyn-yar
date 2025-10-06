<script lang="ts">
  import type { Snippet } from 'svelte'
  import TableData from './TableData.svelte'

  type Props = {
    children: Snippet
  }

  let { children }: Props = $props()
</script>

<TableData>
  <div class="-mx-3 -my-1.5 sm:-mx-1">
    {@render children()}
  </div>
</TableData>
