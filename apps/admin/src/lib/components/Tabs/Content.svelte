<script lang="ts">
  import { getContext } from 'svelte'
  import { melt, type Tabs } from '@melt-ui/svelte'
  import { cn } from '$lib/cn'

  let className: string = ''
  export { className as class }

  export let id: string

  const {
    elements: { content }
  } = getContext<Tabs>('tabs')
</script>

<div use:melt={$content(id)} class={cn('pt-4 md:pt-6', className)}>
  <slot />
</div>
