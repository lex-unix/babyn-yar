<script lang="ts">
  import { page } from '$app/stores'

  export let href: string

  $: active = $page.url.pathname.includes(href)
</script>

<li class="my-0.5 px-4">
  <a
    {href}
    class={`flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-colors hover:bg-gray-700/60 hover:text-white ${
      active ? 'bg-gray-700/60 text-white' : 'text-gray-400'
    }`}
  >
    <div class="flex max-w-full items-center gap-3">
      <slot />
    </div>
  </a>
</li>
