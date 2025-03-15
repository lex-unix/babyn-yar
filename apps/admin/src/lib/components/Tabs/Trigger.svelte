<script lang="ts">
  import { getContext } from 'svelte'
  import { melt, type Tabs } from '@melt-ui/svelte'
  import { cn } from '$lib/cn'

  let className: string = ''
  export { className as class }

  export let id: string

  const {
    elements: { trigger },
    states: { value }
  } = getContext<Tabs>('tabs')
</script>

<button use:melt={$trigger(id)} class={cn('px-2 py-1', className)}>
  <slot isActive={$value === id} />
</button>
