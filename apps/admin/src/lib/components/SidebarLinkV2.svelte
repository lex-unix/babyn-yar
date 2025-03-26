<script lang="ts">
  import { page } from '$app/stores'
  import { cn } from '$lib/cn'
  import { isMobileDrawerOpen } from '$lib/stores'
  import { derived } from 'svelte/store'

  export let href: string

  const isActive = derived(page, $page => $page.url.pathname === href)
</script>

<div class="flex flex-col gap-0.5">
  <span class="relative">
    <span
      class="absolute inset-y-2 -left-4 w-0.5 rounded-full bg-zinc-950 {!$isActive
        ? 'hidden'
        : 'inline-block'}"
      aria-hidden={!isActive}
    ></span>
    <a
      {href}
      class={cn(
        `relative flex min-w-0 cursor-default items-center gap-3 rounded-lg px-2 py-2.5 text-left
        text-base/6 font-medium text-zinc-950 hover:bg-zinc-950/5 *:data-[slot=icon]:shrink-0 sm:py-2
        sm:text-sm/5 *:[svg]:size-6 *:[svg]:fill-zinc-500 hover:*:[svg]:fill-zinc-950 sm:*:[svg]:size-5`,
        $isActive && '*:[svg]:fill-zinc-950'
      )}
      on:click={() => isMobileDrawerOpen.set(false)}
    >
      <slot name="icon" />
      <span class="truncate">
        <slot />
      </span>
    </a>
  </span>
</div>
