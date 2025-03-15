<script lang="ts">
  import { createTabs, melt } from '@melt-ui/svelte'
  import { createEventDispatcher, setContext } from 'svelte'

  export let defaultValue: string

  const dispatch = createEventDispatcher()

  const ctx = createTabs({
    defaultValue: defaultValue,
    onValueChange: ({ next }) => {
      dispatch('change', { value: next })
      return next
    }
  })

  setContext('tabs', ctx)

  const {
    elements: { root }
  } = ctx
</script>

<div use:melt={$root}>
  <slot />
</div>
