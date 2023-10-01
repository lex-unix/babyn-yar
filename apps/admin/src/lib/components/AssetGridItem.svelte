<script lang="ts">
  import { FileIcon } from 'lucide-svelte'

  export let selected: string[]
  export let id: number
  export let src: string
  export let alt: string
  export let fileName: string

  $: checked = selected.includes(id.toString())

  function getFileType(fileName: string) {
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.webp')
    ) {
      return 'image'
    } else {
      return 'file'
    }
  }

  function handleChange(
    e: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) {
    const { value, checked } = e.currentTarget
    if (checked) {
      selected = [...selected, value]
    } else {
      selected = selected.filter(item => item !== value)
    }
  }

  const fileType = getFileType(fileName)
</script>

<li class="p-2.5">
  <div class="group relative">
    <div
      class="h-[140px] max-h-[140px] w-full min-w-[220px] rounded-lg bg-gray-200"
    >
      <div class="h-full w-full">
        <div class="flex h-[140px] items-center justify-center text-gray-500">
          {#if fileType === 'image'}
            <img {src} {alt} class="max-h-full max-w-full" />
          {:else}
            <FileIcon />
          {/if}
        </div>
      </div>
    </div>
    <div
      class="absolute left-0 top-0 z-10 m-2 hidden rounded bg-gray-200 p-1.5 group-hover:block"
      class:checked
    >
      <label class="">
        <input
          type="checkbox"
          name="asset"
          value={id}
          on:change={handleChange}
          {checked}
          class="accent-teal-300"
        />
      </label>
    </div>
    <div class="mt-2 w-full">
      <p class="line-clamp-1 text-sm text-gray-500">{fileName}</p>
    </div>
  </div>
</li>

<style>
  .checked {
    display: block !important;
  }
</style>
