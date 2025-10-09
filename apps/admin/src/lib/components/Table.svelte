<script lang="ts">
  import type { Snippet } from 'svelte'

  type Props = {
    children: Snippet
  }

  let { children }: Props = $props()
</script>

<div class="group -mx-(--page-padding) overflow-x-auto whitespace-nowrap">
  <div class="inline-block min-w-full align-middle sm:px-(--page-padding)">
    <table class="min-w-full table-auto text-left text-sm/6 text-zinc-950">
      {@render children()}
    </table>
  </div>
</div>
