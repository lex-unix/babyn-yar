<script lang="ts">
  import { getContext } from 'svelte'
  import { type Dialog } from '@melt-ui/svelte'
  import ButtonV2 from './ButtonV2.svelte'

  const {
    elements: { trigger }
  } = getContext<Dialog>('dialog')
</script>

<ButtonV2 use={[$trigger.action]} {...$trigger}>
  <slot />
  <slot name="icon" slot="icon" />
</ButtonV2>
