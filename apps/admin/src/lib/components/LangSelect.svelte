<script lang="ts">
  import { Select, SelectTrigger, SelectMenu, SelectItem } from '$components'
  import { langOptions } from '$lib/select-option'

  export let lang: string
  export let error: string | undefined = undefined

  let defaultValue = lang
    ? langOptions.find(option => option.value === lang)
    : undefined
</script>

<div>
  <label for="select-lang" class="mb-1.5 block text-gray-500">Мова</label>
  {#if error}
    <p class="-mt-1.5 mb-1.5 text-red-500">{error}</p>
  {/if}
  <Select bind:selected={lang} defaultSelected={defaultValue}>
    <SelectTrigger id="select-lang">Обрати мову</SelectTrigger>
    <SelectMenu>
      {#each langOptions as { value, label }}
        <SelectItem {value} {label} />
      {/each}
    </SelectMenu>
  </Select>
</div>
