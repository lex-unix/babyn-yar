<script lang="ts">
  export let value: string = ''
  export let name: string
  export let label: string
  export let required: boolean = false
  export let error: string | undefined = undefined
</script>

<label class="block text-gray-400">
  {label}
  {#if error}
    <p class="-mb-1.5 text-red-500">{error}</p>
  {/if}
  <input
    {name}
    {required}
    type="text"
    bind:value
    class="mt-1.5 block h-10 w-full rounded border px-2 text-base text-gray-900 outline-none hover:border-sky-400 focus:border-sky-400 focus:ring focus:ring-sky-100"
  />
</label>
