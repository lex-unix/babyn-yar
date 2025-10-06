<script lang="ts">
  const { children } = $props()
</script>

<div
  class="mt-6 flex flex-col-reverse items-center justify-end gap-3 *:w-full sm:mt-4 sm:flex-row sm:*:w-auto"
>
  {@render children()}
</div>
