<script lang="ts">
  import { cn } from '$lib/cn'

  let className = ''
  export { className as class }
</script>

<th
  class={cn(
    'border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-(--page-padding) last:pr-(--page-padding)',
    className
  )}
>
  <slot />
</th>
