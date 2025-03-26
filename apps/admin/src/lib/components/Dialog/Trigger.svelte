<script lang="ts">
  import { type Dialog, melt } from '@melt-ui/svelte'
  import { getContext } from 'svelte'

  const {
    elements: { trigger }
  } = getContext<Dialog>('dialog')
</script>

<button
  use:melt={$trigger}
  class="flex items-center gap-3 rounded-md bg-indigo-600 px-4 py-3 text-sm leading-none text-white transition-colors duration-150 ease-in-out outline-none hover:bg-indigo-700 disabled:bg-indigo-500"
>
  <slot name="icon" />
  <span class="text-sm leading-none font-semibold">
    <slot name="text" />
  </span>
</button>
