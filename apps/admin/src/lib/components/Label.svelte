<script lang="ts">
  let htmlFor: string
  export { htmlFor as for }
</script>

<label
  for={htmlFor}
  class="text-base/6 text-zinc-950 select-none data-disabled:opacity-50 sm:text-sm/6"
  data-slot="label"
>
  <slot />
</label>
