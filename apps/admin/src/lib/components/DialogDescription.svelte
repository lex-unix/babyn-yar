<script lang="ts">
  const { children } = $props()
</script>

<p class="mt-2 text-base/6 text-pretty text-zinc-500 sm:text-sm/6">
  {@render children()}
</p>
