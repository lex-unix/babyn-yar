<script lang="ts">
  import { FileVideo2, FileText } from 'lucide-svelte'

  export let contentType: string
  export let src: string
  export let fileName: string
</script>

<div
  class="h-[140px] max-h-[140px] w-full min-w-[220px] overflow-x-hidden rounded-lg bg-gray-200"
>
  <div class="h-full w-full">
    <div class="flex h-[140px] items-center justify-center text-gray-500">
      {#if contentType.startsWith('image')}
        <img {src} alt={fileName} class="max-h-full max-w-full" />
      {:else if contentType.startsWith('video')}
        <FileVideo2 class="h-20 w-20 text-amber-400" />
      {:else}
        <FileText class="h-20 w-20 text-blue-400" />
      {/if}
    </div>
  </div>
</div>
<p class="line-clamp-1 text-center text-sm text-gray-400">{fileName}</p>
