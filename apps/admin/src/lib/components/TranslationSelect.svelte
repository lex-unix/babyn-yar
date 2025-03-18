<script lang="ts">
  import {
    createCombobox,
    melt,
    type ComboboxOptionProps
  } from '@melt-ui/svelte'
  import { Check, ChevronDown, SearchIcon, XIcon } from 'lucide-svelte'
  import type { Translation } from '$lib/types'
  import { createEventDispatcher } from 'svelte'
  import { debounce } from '$lib/debounce'

  export let translations: Translation[] = []
  export let selected: Translation | undefined = undefined

  const dispatch = createEventDispatcher()

  const toOption = (
    translation: Translation
  ): ComboboxOptionProps<Translation> => ({
    value: translation,
    label: translation.title,
    disabled: false
  })

  const {
    elements: { menu, input, option, label },
    states: { open, inputValue, selected: selectedState }
  } = createCombobox<Translation>({
    forceVisible: true,
    defaultSelected: selected ? toOption(selected) : undefined,
    onSelectedChange: ({ curr, next }) => {
      if (curr?.value.id === next?.value.id) {
        clear()
        return undefined
      }
      return next
    }
  })

  function clear() {
    $selectedState = undefined
    dispatch('search', { search: '' })
  }

  function search(
    e: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) {
    const input = e.target as HTMLInputElement
    dispatch('search', { search: input.value })
  }

  $: if (!$open) {
    $inputValue = $selectedState?.label ?? ''
  }

  $: selected = $selectedState?.value
</script>

<div class="w-full max-w-[500px]">
  <label use:melt={$label}>
    <span class="mb-1.5 block text-gray-500">Переклад</span>
    <div class="relative flex items-center justify-between">
      <input
        use:melt={$input}
        on:input={debounce(search, 200)}
        placeholder="Пошук перекладу..."
        class="flex h-10 w-full rounded border bg-white py-2 pl-10 pr-10 leading-none outline-none hover:border-sky-400 focus:border-sky-400 focus:ring focus:ring-sky-100 data-[state=open]:border-sky-400 data-[state=open]:ring data-[state=open]:ring-sky-100"
      />
      <SearchIcon
        class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-900"
        size={16}
      />
      <div class="absolute right-2 top-1/2 z-10 -translate-y-1/2">
        {#if $selectedState}
          <button
            type="button"
            class="flex items-center justify-center rounded-full p-0.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
            on:click={clear}
          >
            <XIcon class="h-4 w-4" />
          </button>
        {:else}
          <ChevronDown class="h-4 w-4" />
        {/if}
      </div>
    </div>
  </label>
</div>

{#if $open}
  <ul
    class="z-10 flex max-h-[300px] flex-col overflow-hidden rounded border"
    use:melt={$menu}
  >
    <div
      class="flex max-h-full flex-col gap-1 overflow-y-auto bg-white px-2 py-2 text-black"
    >
      {#each translations as translation, index (index)}
        <li
          use:melt={$option(toOption(translation))}
          class="relative cursor-pointer scroll-my-2 rounded py-2 pl-4 pr-4 hover:bg-indigo-100 hover:text-indigo-800 data-[highlighted]:bg-indigo-100 data-[highlighted]:text-indigo-800"
          class:selected={selected?.id === translation.id}
        >
          {#if selected?.id === translation.id}
            <div class="absolute left-2 top-1/2 -translate-y-1/2">
              <Check class="h-4 w-4" />
            </div>
          {/if}
          <div class="pl-4">
            <span class="line-clamp-1">{translation.title}</span>
          </div>
        </li>
      {:else}
        <li class="relative cursor-pointer rounded-md py-1 pl-8 pr-4">
          Не знайдено
        </li>
      {/each}
    </div>
  </ul>
{/if}

<style>
  .selected {
    background-color: var(--color-indigo-100);
    color: var(--color-indigo-800);
  }
</style>
