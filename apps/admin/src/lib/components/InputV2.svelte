<script lang="ts">
  import { cn } from '$lib/cn'
  import { createEventDispatcher } from 'svelte'
  import type { HTMLInputAttributes } from 'svelte/elements'

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface $$Props extends HTMLInputAttributes {
    value?: string
    invalid?: boolean
    class?: string
  }

  export let value = ''
  export let invalid = false

  let className: string = ''
  export { className as class }

  const dispatch = createEventDispatcher()

  function handleInput(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement
    }
  ) {
    dispatch('input', { value: e.currentTarget.value })
    value = e.currentTarget.value
  }
</script>

<span
  class="relative block w-full before:absolute before:inset-px before:rounded-lg before:bg-white before:shadow-sm after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset has-data-invalid:before:shadow-red-500/10 sm:focus-within:after:ring-2 sm:focus-within:after:ring-blue-500"
  data-slot="control"
>
  <input
    {value}
    class={cn(
      'relative block w-full rounded-lg border border-zinc-950/10 bg-transparent px-3.5 py-2.5 text-base/6 text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-950/20 focus:outline-hidden data-invalid:border-red-500 data-invalid:hover:border-red-500 sm:px-3 sm:py-1.5 sm:text-sm/6',
      className
    )}
    on:input={handleInput}
    data-invalid={invalid ? 'true' : undefined}
    {...$$restProps}
  />
</span>
