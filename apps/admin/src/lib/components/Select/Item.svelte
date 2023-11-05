<script lang="ts">
  import { type Select, melt } from '@melt-ui/svelte'
  import { getContext } from 'svelte'

  export let label: string
  export let value: string

  const {
    elements: { option },
    helpers: { isSelected }
  } = getContext<Select>('select')
</script>

<div
  use:melt={$option({ value, label })}
  class={`p-2 hover:cursor-pointer hover:bg-gray-400/10 ${
    $isSelected(value) ? 'text-indigo-600' : ''
  }`}
>
  {label}
</div>
