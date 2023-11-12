<script lang="ts">
  import { type Select, melt } from '@melt-ui/svelte'
  import { getContext } from 'svelte'

  const {
    elements: { menu },
    states: { open }
  } = getContext<Select>('select')
</script>

{#if $open}
  <div
    use:melt={$menu}
    class="z-10 flex max-h-[300px] flex-col overflow-y-auto rounded border bg-white p-1"
  >
    <slot />
  </div>
{/if}
