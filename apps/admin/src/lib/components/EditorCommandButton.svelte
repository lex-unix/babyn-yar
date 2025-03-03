<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let active: boolean = false

  const dispatch = createEventDispatcher()

  function click() {
    dispatch('click')
  }
</script>

<button
  type="button"
  on:click={click}
  class="rounded p-1.5 hover:bg-gray-100"
  class:active
>
  <slot />
</button>

<style lang="postcss">
  .active {
    @apply bg-gray-100;
  }
</style>
