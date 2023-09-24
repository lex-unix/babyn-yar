<script>
  import { Plus } from 'lucide-svelte'
</script>

<div class="flex items-center justify-between">
  <h1 class="text-2xl font-semibold">Події</h1>
  <a
    href="/content/events/create"
    class="flex items-center gap-3 rounded-md border border-sky-700/10 bg-sky-400 px-4 py-2 text-sm font-medium text-white"
  >
    <Plus size={16} />
    <span> Cтворити </span>
  </a>
</div>
