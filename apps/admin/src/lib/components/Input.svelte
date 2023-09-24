<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let type: string = 'text'
  export let name: string
  export let label: string
  export let required: boolean = false

  const dispatch = createEventDispatcher()

  function handleChange(
    e: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) {
    dispatch('change', {
      name,
      value: e.currentTarget.value
    })
  }
</script>

<label class="block text-gray-400">
  {label}
  <input
    {type}
    {name}
    {required}
    on:change={handleChange}
    class="mt-1.5 block h-10 w-full rounded border px-2 text-base text-gray-900 outline-none hover:border-sky-400 focus:border-sky-400 focus:ring focus:ring-sky-100"
  />
</label>
