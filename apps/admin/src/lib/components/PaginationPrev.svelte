<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte'

  export let disabled: boolean
</script>

<div class="grow basis-0">
  <button
    {disabled}
    on:click
    class="relative isolate inline-flex items-baseline justify-center gap-x-2 rounded-lg border border-transparent px-3.5 py-2.5 text-base/6 font-semibold text-zinc-950 [--btn-icon:var(--color-zinc-400)] hover:bg-zinc-950/5 hover:[--btn-icon:var(--color-zinc-700)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50 sm:px-3 sm:py-1.5 sm:text-sm/6 *:[svg]:-mx-0.5 *:[svg]:my-0.5 *:[svg]:size-5 *:[svg]:shrink-0 *:[svg]:self-center *:[svg]:text-(--btn-icon) sm:*:[svg]:my-1 sm:*:[svg]:size-4"
  >
    <ArrowLeft />
    Попередня
  </button>
</div>
