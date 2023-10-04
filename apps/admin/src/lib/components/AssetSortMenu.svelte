<script lang="ts">
  import { createDropdownMenu, melt } from '@melt-ui/svelte'
  import { createEventDispatcher } from 'svelte'
  import { ArrowUpIcon, ArrowDownIcon } from 'lucide-svelte'

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
      value: 'file_name',
      name: 'Назва файлу',
      icon: ArrowUpIcon
    },
    {
      value: '-file_name',
      name: 'Назва файлу',
      icon: ArrowDownIcon
    }
  ]

  type EventDispatcher = {
    select: string
  }

  let selected = menuItems[0]

  function select(item: (typeof menuItems)[number]) {
    const value = item.value === 'default' ? defaultSort : item.value
    dispatch('select', value)
    selected = item
  }

  const dispatch = createEventDispatcher<EventDispatcher>()

  const {
    elements: { menu, item, trigger },
    states: { open }
  } = createDropdownMenu()
</script>

<button
  use:melt={$trigger}
  class="inline-flex items-center gap-0.5 text-gray-400 transition-colors hover:text-gray-900"
>
  <span>Сортувати: <span class="lowercase">{selected.name}</span></span>
  <svelte:component this={selected.icon} size={14} />
</button>

{#if open}
  <div
    use:melt={$menu}
    class="lg:max-h-none; z-10 mt-2.5 flex max-h-[300px] min-w-[220px] flex-col rounded-md bg-white p-1 shadow-lg shadow-gray-900/30"
  >
    {#each menuItems as menuItem}
      <div
        use:melt={$item}
        on:m-click={() => select(menuItem)}
        class="relative z-20 flex h-10 min-h-[24px] select-none items-center gap-1 rounded py-2 pl-6 pr-1 text-sm leading-none text-gray-600 outline-none data-[highlighted]:bg-gray-100"
        class:active={selected.value === menuItem.value}
      >
        <span>
          {menuItem.name}
        </span>
        <svelte:component
          this={menuItem.icon}
          class="text-gray-400"
          size={16}
        />
      </div>
    {/each}
  </div>
{/if}

<style lang="postcss">
  .active {
    @apply text-teal-500;
  }
</style>
