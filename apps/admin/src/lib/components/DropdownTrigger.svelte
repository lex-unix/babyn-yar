<script lang="ts">
  import { type DropdownMenu } from '@melt-ui/svelte'
  import { getContext } from 'svelte'
  import ButtonV2 from './ButtonV2.svelte'

  const {
    elements: { trigger }
  } = getContext<DropdownMenu>('dropdown')
</script>

<ButtonV2 plain use={[$trigger.action]} {...trigger}>
  <slot slot="default" />
  <slot name="icon" slot="icon" />
</ButtonV2>

