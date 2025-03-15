<script lang="ts">
  import { getContext } from 'svelte'
  import { melt, type Tabs } from '@melt-ui/svelte'
  import { cn } from '$lib/cn'

  let className: string = ''
  export { className as class }

  const {
    elements: { list }
  } = getContext<Tabs>('tabs')
</script>

<div use:melt={$list} class={cn('flex gap-3', className)}>
  <slot />
</div>
