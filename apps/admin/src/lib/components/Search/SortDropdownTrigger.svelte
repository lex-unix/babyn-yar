<script lang="ts">
  import { DropdownTrigger } from '$components'
  import type { ArrowDownIcon } from 'lucide-svelte'

  type Icon = typeof ArrowDownIcon

  export let icon: Icon | undefined
</script>

<DropdownTrigger
  class="gap-0.5 !bg-transparent p-1.5 text-sm text-gray-400 transition-all outline-none hover:text-gray-900 focus:text-gray-900 focus:ring focus:ring-sky-300"
>
  <span>
    Сортувати:
    <span class="lowercase">
      <slot />
    </span>
  </span>
  <svelte:component this={icon} size={14} />
</DropdownTrigger>
