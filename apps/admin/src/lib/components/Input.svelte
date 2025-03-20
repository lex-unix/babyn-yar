<script lang="ts">
  import type { HTMLInputTypeAttribute } from 'svelte/elements'
  import { Eye, EyeOff } from 'lucide-svelte'
  import { cn } from '$lib/cn'

  let className = ''
  export { className as class }

  export let value: string = ''
  export let label: string
  export let error: string | undefined = undefined
  export let type: HTMLInputTypeAttribute = 'text'

  let isPasswordVisible = false

  function change(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement
    }
  ) {
    value = e.currentTarget.value
  }

  function togglePasswordVisibility() {
    isPasswordVisible = !isPasswordVisible
  }
</script>

<label class="block text-gray-500">
  {label}
  {#if error}
    <p class="mt-1.5 text-red-500">{error}</p>
  {/if}
  <div class="relative w-full">
    <input
      {value}
      type={isPasswordVisible && type === 'password' ? 'text' : type}
      {...$$restProps}
      autocomplete="off"
      aria-invalid={error ? 'true' : undefined}
      on:input={change}
      class={cn(
        'mt-1.5 block h-10 w-full rounded border bg-white px-2 text-base text-gray-900 transition-all outline-none hover:border-sky-400 focus:border-sky-400 focus:ring focus:ring-sky-100 aria-invalid:border-red-400',
        className
      )}
    />
    {#if type === 'password'}
      <button
        type="button"
        on:click={togglePasswordVisibility}
        class="absolute top-1/2 right-4 -translate-y-1/2"
      >
        {#if isPasswordVisible}
          <EyeOff size={20} class="text-gray-400 hover:text-indigo-400" />
        {:else}
          <Eye size={20} class="text-gray-400 hover:text-indigo-400" />
        {/if}
      </button>
    {/if}
  </div>
</label>
