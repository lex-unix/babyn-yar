<script lang="ts">
  import { SearchIcon } from 'lucide-svelte'
  import { createEventDispatcher } from 'svelte'
  import { debounce } from '$lib/debounce'
  import { page } from '$app/stores'

  export let debounceWait = 300
  export let defaultValue = ''

  let searchParam = $page.url.searchParams.get('search') || defaultValue

  const dispatch = createEventDispatcher()

  function search(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement
    }
  ) {
    const input = e.target as HTMLInputElement
    dispatch('search', { search: input.value })
  }
</script>

<div
  class="relative flex w-full items-center rounded-lg border bg-white pr-2 focus-within:border-sky-400 focus-within:ring focus-within:ring-sky-100 hover:border-sky-400"
>
  <div class="w-full flex-[1_1_60%]">
    <div class="relative w-full">
      <input
        type="search"
        placeholder="Пошук..."
        value={searchParam}
        on:input={debounce(search, debounceWait)}
        class="w-full border-none bg-transparent py-3.5 pl-10 outline-none placeholder:text-gray-400"
      />
      <SearchIcon
        class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-900"
        size={16}
      />
    </div>
  </div>
  {#if $$slots.filters}
    <div class="flex flex-[0_1_40%] items-center justify-end gap-4">
      <slot name="filters" />
    </div>
  {/if}
</div>

<style>
  input[type='search']::-webkit-search-cancel-button {
    -webkit-appearance: none;
  }
</style>
