<script lang="ts">
  import { createDialog, melt } from '@melt-ui/svelte'
  import { UploadCloudIcon, XIcon } from 'lucide-svelte'
  import FileListItem from './FileListItem.svelte'

  export function openDialog() {
    open.set(true)
  }

  export function closeDialog() {
    open.set(false)
  }

  let fileInput: HTMLInputElement
  let files: { file: File; fileName: string; extension: string }[] = []
  let isSubmitting = false

  function addFiles(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement
    }
  ) {
    if (!e.currentTarget.files) return
    const fileList = Array.from(e.currentTarget.files).map(file => ({
      file,
      fileName: file.name.split('.')[0],
      extension: file.name.split('.').at(-1) as string
    }))

    files = [...files, ...fileList]
  }

  function removeFile(e: CustomEvent<{ index: number }>) {
    const { index } = e.detail
    files = [...files.slice(0, index), ...files.slice(index + 1)]
  }

  function openFileBrowser() {
    if (!fileInput) return
    fileInput.click()
  }

  async function submit() {
    if (files.length < 0) return

    isSubmitting = true

    const formData = new FormData()

    files.forEach(({ file, fileName, extension }) => {
      formData.append('assets', file, fileName + '.' + extension)
    })

    const res = await fetch('http://localhost:8000/v1/assets', {
      method: 'POST',
      body: formData
    })

    if (res.ok) {
      console.log('ggggg')
    }

    isSubmitting = false
  }

  const {
    elements: { trigger, overlay, content, title, close, portalled },
    states: { open }
  } = createDialog({
    forceVisible: true
  })
</script>

<button
  use:melt={$trigger}
  class="flex items-center gap-3 rounded-md border border-teal-700/10 bg-teal-500 px-4 py-3 text-sm font-medium leading-none text-white outline-none focus:bg-teal-600"
>
  <span>Завантажити файли</span>
  <UploadCloudIcon size={16} />
</button>

<div use:melt={$portalled}>
  {#if $open}
    <div use:melt={$overlay} class="fixed inset-0 z-50 bg-black/50" />
    <div
      class="fixed inset-0 z-50 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden p-6 shadow-lg"
      use:melt={$content}
    >
      <div
        class="relative m-auto min-w-[720px] max-w-[800px] rounded-lg bg-white p-9"
      >
        <div class="mb-5">
          <h2 use:melt={$title} class="text-xl font-semibold text-gray-900">
            Завантажити файли
          </h2>
        </div>
        <div class="min-h-[30px]">
          {#if files}
            <ul class="max-h-[400px] overflow-y-auto">
              {#each files as { file, fileName, extension }, index}
                <FileListItem
                  {index}
                  {extension}
                  src={URL.createObjectURL(file)}
                  bind:fileName
                  on:remove={removeFile}
                />
              {/each}
            </ul>
          {/if}
        </div>
        <div
          class="-mb-9 -ml-9 -mr-9 flex min-h-[80px] items-center justify-end gap-2.5 rounded-bl-lg rounded-br-lg bg-gray-100 px-9"
        >
          <input
            type="file"
            hidden
            bind:this={fileInput}
            multiple
            on:change={addFiles}
          />
          <button
            class="rounded-md border bg-white px-4 py-3 font-medium leading-none outline-none focus:ring focus:ring-gray-300 disabled:opacity-60"
            disabled={isSubmitting}
            on:click={openFileBrowser}
          >
            Додати файл
          </button>
          <button
            class="rounded-md bg-teal-500 px-4 py-3 font-medium leading-none text-white outline-none focus:bg-teal-600 disabled:opacity-60"
            disabled={isSubmitting}
            on:click={submit}
          >
            Завантажити
          </button>
        </div>
        <button
          class="absolute right-9 top-9 inline-flex h-7 w-7 appearance-none items-center justify-center rounded-full p-1 text-gray-800 outline-none hover:bg-gray-100 focus:ring focus:ring-teal-300"
          use:melt={$close}
          aria-label="Закрити"
        >
          <XIcon size={20} />
        </button>
      </div>
    </div>
  {/if}
</div>
