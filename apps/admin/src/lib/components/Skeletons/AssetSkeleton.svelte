<script lang="ts">
  export let count: number = 10
  $: placeholders = Array(count).fill(null)
</script>

<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
{#each placeholders as _}
  <li class="animate-pulse pt-2.5">
    <div class="h-[140px] w-full min-w-[220px] rounded-lg bg-gray-200" />
  </li>
{/each}
