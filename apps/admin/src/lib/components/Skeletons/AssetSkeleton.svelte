<script lang="ts">
  type Props = {
    count?: number
  }

  let { count = 10 }: Props = $props()
  let placeholders = $derived(Array(count).fill(null))
</script>

{#each placeholders}
  <li class="animate-pulse pt-2.5">
    <div class="h-[140px] w-full min-w-[220px] rounded-lg bg-gray-200"></div>
  </li>
{/each}
