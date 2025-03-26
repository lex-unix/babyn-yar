<script lang="ts">
  export let href: string
</script>

<a
  {href}
  class="flex items-center gap-3 rounded-md bg-indigo-600 px-4 py-3 text-sm leading-none font-semibold text-white transition duration-150 ease-in-out hover:bg-indigo-700 disabled:opacity-70"
>
  <slot name="icon" />
  <span>
    <slot />
  </span>
</a>
