<script lang="ts">
  import { melt, type Dialog } from '@melt-ui/svelte'
  import { getContext } from 'svelte'

  const {
    elements: { title }
  } = getContext<Dialog>('dialog')
</script>

<h2
  use:melt={$title}
  class="text-lg/6 font-semibold text-balance text-zinc-950 sm:text-base/6"
>
  <slot />
</h2>
