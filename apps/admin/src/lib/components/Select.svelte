<script lang="ts">
  import { cn } from '$lib/cn'
  import { createSelect, melt } from '@melt-ui/svelte'
  import { ChevronsUpDown } from 'lucide-svelte'
  import { createEventDispatcher, setContext } from 'svelte'

  let className = ''
  export { className as class }

  export let name: string | undefined = undefined
  export let placeholder: string | undefined = undefined
  export let invalid = false
  export let defaultValue: { value: string; label: string } | undefined =
    undefined

  export let value = defaultValue?.value ?? undefined

  const dispatch = createEventDispatcher()

  const ctx = createSelect<string>({
    name,
    defaultSelected: defaultValue ? defaultValue : undefined,
    forceVisible: true,
    positioning: {
      fitViewport: true,
      sameWidth: true,
      placement: 'bottom'
    },
    onSelectedChange: ({ next }) => {
      dispatch('change', { value: next?.value })
      return next
    }
  })

  setContext('select', ctx)

  const {
    elements: { trigger, menu },
    states: { selectedLabel, selected, open }
  } = ctx

  $: value = $selected?.value ?? ''
</script>

<button
  use:melt={$trigger}
  type="button"
  class="group relative block w-full before:absolute before:inset-px before:rounded-lg before:bg-white before:shadow-sm after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset focus:outline-hidden focus:after:ring-2 focus:after:ring-blue-500"
  data-slot="control"
  data-invalid={invalid || undefined}
>
  <span
    class={cn(
      'relative block min-h-11 w-full appearance-none rounded-lg border border-zinc-950/10 bg-transparent py-2.5 pr-7 pl-3.5 text-left text-base/6 text-zinc-950 group-hover:border-zinc-950/20 group-data-invalid:border-red-500 group-data-hover:group-data-invalid:border-red-500 sm:min-h-9 sm:py-1.5 sm:pl-3 sm:text-sm/6',
      className
    )}
  >
    {#if $selectedLabel}
      <div class="flex min-w-0 items-center">
        <span class="ml-2.5 truncate first:ml-0 sm:ml-2 sm:first:ml-0">
          {$selectedLabel}
        </span>
      </div>
    {:else}
      <span class="block truncate text-zinc-500">
        {placeholder}
      </span>
    {/if}
  </span>
  <span
    class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
  >
    <ChevronsUpDown
      class="size-5 stroke-zinc-500 group-data-disabled:stroke-zinc-600 sm:size-4"
    />
  </span>
</button>

{#if $open}
  <div
    use:melt={$menu}
    class="isolate w-max scroll-py-1 overflow-y-scroll overscroll-contain rounded-xl bg-white/75 p-1 shadow-lg ring-1 ring-zinc-950/10 outline outline-transparent backdrop-blur-xl select-none"
  >
    <slot />
  </div>
{/if}
