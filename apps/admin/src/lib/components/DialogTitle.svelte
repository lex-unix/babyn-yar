<script lang="ts">
  import { Dialog } from 'bits-ui'

  const { children } = $props()
</script>

<Dialog.Title
  class="text-lg/6 font-semibold text-balance text-zinc-950 sm:text-base/6"
>
  {@render children()}
</Dialog.Title>
