<script lang="ts">
  import type { Snippet } from 'svelte'
  import { DropdownMenu } from 'bits-ui'
  import Button from './Button.svelte'

  type Props = {
    plain?: boolean
    icon?: Snippet
    children?: Snippet
  }

  const {
    plain = false,
    icon = undefined,
    children = undefined
  }: Props = $props()
</script>

<DropdownMenu.Trigger>
  {#snippet child({ props })}
    <Button {plain} {icon} {...props} class="data-[state=open]:bg-zinc-950/5">
      {@render children?.()}
    </Button>
  {/snippet}
</DropdownMenu.Trigger>
