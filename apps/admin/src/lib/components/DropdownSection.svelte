<script lang="ts">
  import { DropdownMenu } from 'bits-ui'
  import type { Snippet } from 'svelte'

  type Props = {
    children: Snippet
  }

  const { children }: Props = $props()
</script>

<DropdownMenu.Group class="col-span-full grid grid-cols-subgrid">
  {@render children()}
</DropdownMenu.Group>
