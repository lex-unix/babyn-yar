<script lang="ts">
  import { AlertDialog } from 'bits-ui'

  const { children } = $props()
</script>

<AlertDialog.Title
  class="text-center text-base/6 font-semibold text-balance text-zinc-950 sm:text-left sm:text-sm/6 sm:text-wrap"
>
  {@render children()}
</AlertDialog.Title>
