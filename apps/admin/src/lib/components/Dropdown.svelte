<script lang="ts">
  import { DropdownMenu } from 'bits-ui'
  const { children } = $props()
</script>

<DropdownMenu.Root>
  {@render children()}
</DropdownMenu.Root>
