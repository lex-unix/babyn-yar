<script lang="ts">
  import { Dialog } from 'bits-ui'
  import Button from './Button.svelte'
  import type { Snippet } from 'svelte'

  type Props = {
    plain?: boolean
    children?: Snippet
  }

  let { plain = true, children }: Props = $props()
</script>

<Dialog.Close>
  {#snippet child({ props })}
    <Button {plain} {...props}>
      {#if children}
        {@render children()}
      {:else}
        Відмінити
      {/if}
    </Button>
  {/snippet}
</Dialog.Close>
