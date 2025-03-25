<script lang="ts">
  import { createDropdownMenu, createSync } from '@melt-ui/svelte'
  import { setContext } from 'svelte'

  export let open: boolean = false

  const ctx = createDropdownMenu({
    defaultOpen: true,
    forceVisible: true,
    onOpenChange: ({ next }) => {
      return next
    }
  })
  setContext('dropdown', ctx)

  const { states } = ctx

  const sync = createSync(states)
  $: sync.open(open, v => (open = v))
</script>

<slot />
