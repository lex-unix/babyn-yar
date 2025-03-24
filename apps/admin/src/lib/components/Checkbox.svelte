<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let checked = false
  const dispatch = createEventDispatcher()
</script>

<input
  type="checkbox"
  on:input={() => dispatch('input')}
  {checked}
  class="accent-zinc-950"
/>
