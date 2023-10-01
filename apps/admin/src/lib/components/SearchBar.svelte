<script lang="ts">
  import { SearchIcon } from 'lucide-svelte'
  import { createEventDispatcher } from 'svelte'

  export let value: string

  const dispatch = createEventDispatcher()

  function search(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement
    }
  ) {
    dispatch('search', { value: e.currentTarget.value })
  }
</script>

<div
  class="relative flex w-full items-center rounded-lg border pr-2 text-sm hover:border-teal-400"
>
  <div class="w-full flex-[1_1_60%]">
    <div class="relative w-full">
      <input
        type="search"
        bind:value
        placeholder="Пошук файлів..."
        on:change={search}
        class="w-full border-none bg-transparent py-3.5 pl-10 outline-none placeholder:text-gray-400"
      />
      <SearchIcon
        class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-900"
        size={16}
      />
    </div>
  </div>
  <div class="flex flex-[1_1_40%] items-center justify-end gap-4">
    <button class="text-gray-400 transition-colors hover:text-gray-900">
      Сортувати: за замовчуванням
    </button>
  </div>
</div>

<style>
  input[type='search']::-webkit-search-cancel-button {
    -webkit-appearance: none;
  }
</style>
