<script lang="ts">
  import { page } from '$app/stores'

  export let href: string

  $: active = $page.url.pathname.includes(href)
</script>

<li class="my-0.5">
  <a
    {href}
    class="flex items-center gap-4 rounded-lg p-3 text-sm font-medium text-gray-400 outline-none transition-colors hover:bg-gray-700/60 hover:text-white focus-visible:ring-2 focus-visible:ring-gray-400"
    class:active
  >
    <div class="flex max-w-full items-center gap-3">
      <slot />
    </div>
  </a>
</li>

<style lang="postcss">
  .active {
    @apply bg-gray-700/60 text-white;
  }
</style>
