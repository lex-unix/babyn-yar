<script lang="ts">
  import type { HTMLInputTypeAttribute } from 'svelte/elements'

  export let value: string = ''
  export let name: string
  export let label: string
  export let required: boolean = false
  export let error: string | undefined = undefined
  export let type: HTMLInputTypeAttribute = 'text'

  function change(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement
    }
  ) {
    value = e.currentTarget.value
  }
</script>

<label class="block text-gray-400">
  {label}
  {#if error}
    <p class="-mb-1.5 text-red-500">{error}</p>
  {/if}
  <input
    {name}
    {required}
    {type}
    {value}
    on:input={change}
    class="mt-1.5 block h-10 w-full rounded border px-2 text-base text-gray-900 outline-none hover:border-teal-400 focus:border-teal-400 focus:ring focus:ring-teal-100"
  />
</label>
