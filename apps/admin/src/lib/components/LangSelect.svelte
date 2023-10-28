<script lang="ts">
  import { melt, createSelect } from '@melt-ui/svelte'
  import { ChevronDown } from 'lucide-svelte'

  export let lang: string

  const langOptions = [
    { value: 'ua', label: 'Українська' },
    { value: 'en', label: 'Англійська' }
  ]

  let defaultValue = lang
    ? langOptions.find(option => option.value === lang)
    : langOptions[0]

  $: {
    lang = $selected!.value
  }

  const {
    elements: { trigger, menu, option },
    states: { selectedLabel, open, selected },
    helpers: { isSelected }
  } = createSelect({
    forceVisible: true,
    defaultSelected: defaultValue,
    positioning: {
      placement: 'bottom',
      fitViewport: true,
      sameWidth: true
    }
  })
</script>

<div>
  <label for="select-lang" class="mb-1.5 block text-gray-400">Мова</label>
  <button
    use:melt={$trigger}
    id="select-lang"
    type="button"
    class="flex min-w-[220px] items-center justify-between rounded border bg-white px-3 py-2 leading-none outline-none hover:border-teal-400 focus:border-teal-400 focus:ring focus:ring-teal-100"
  >
    {$selectedLabel || 'Обрати мову'}
    <ChevronDown class="h-5 w-5" />
  </button>
</div>

{#if $open}
  <div
    use:melt={$menu}
    class="z-10 flex max-h-[300px] flex-col overflow-y-auto rounded border bg-white p-1"
  >
    {#each langOptions as { value, label }}
      <div
        use:melt={$option({ value, label })}
        class={`p-2 hover:cursor-pointer hover:bg-gray-400/10 ${
          $isSelected(value) ? 'text-teal-500' : ''
        }`}
      >
        {label}
      </div>
    {/each}
  </div>
{/if}
