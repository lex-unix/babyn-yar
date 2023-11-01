<script lang="ts">
  export let href: string
</script>

<a
  {href}
  class="flex items-center gap-3 rounded-md border border-sky-700/10 bg-teal-500 px-4 py-2 text-sm font-medium text-white"
>
  <slot name="icon" />
  <span>
    <slot />
  </span>
</a>
