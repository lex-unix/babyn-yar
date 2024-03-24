<script lang="ts">
  import {
    Dropdown,
    DropdownMenu,
    DropdownTrigger,
    DropdownItem
  } from '$components'
  import { ArrowDownIcon, ArrowUpIcon } from 'lucide-svelte'
  import { createEventDispatcher } from 'svelte'

  const defaultSort = '-created_at'

  const menuItems = [
    {
      value: 'default',
      name: 'За замовчуванням'
    },
    {
      value: 'created_at',
      name: 'Дата створення',
      icon: ArrowUpIcon
    },
    {
      value: '-created_at',
      name: 'Дата створення',
      icon: ArrowDownIcon
    },
    {
      value: 'occured_on',
      name: 'Дата проведення',
      icon: ArrowUpIcon
    },
    {
      value: '-occured_on',
      name: 'Дата проведення',
      icon: ArrowDownIcon
    }
  ]

  const dispatch = createEventDispatcher()

  let selected = menuItems[0]

  function select(item: (typeof menuItems)[number]) {
    if (selected.value === item.value) return

    const value = item.value === 'default' ? defaultSort : item.value
    dispatch('select', value)
    selected = item
  }
</script>

<Dropdown>
  <DropdownTrigger
    class="gap-0.5 !bg-transparent p-1.5 text-sm text-gray-400 outline-none transition-all hover:text-gray-900 focus:text-gray-900 focus:ring focus:ring-sky-300"
  >
    <span>Сортувати: <span class="lowercase">{selected.name}</span></span>
    <svelte:component this={selected.icon} size={14} />
  </DropdownTrigger>
  <DropdownMenu>
    {#each menuItems as item}
      <DropdownItem
        on:select={() => select(item)}
        class="h-10 shrink-0 text-sm data-[highlighted]:bg-gray-100 {item.value ===
        selected.value
          ? 'text-indigo-600'
          : ''}"
      >
        <span>{item.name}</span>
        <span>
          <svelte:component this={item.icon} class="h-4 w-4 text-gray-400" />
        </span>
      </DropdownItem>
    {/each}
  </DropdownMenu>
</Dropdown>
