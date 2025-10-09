<script lang="ts">
  const { children } = $props()
</script>

<div
  class="mt-8 flex flex-col-reverse items-center justify-end gap-3 *:w-full sm:flex-row sm:*:w-auto"
>
  {@render children()}
</div>
