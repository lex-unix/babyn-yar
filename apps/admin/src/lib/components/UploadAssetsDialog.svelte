<script lang="ts">
  import { UploadCloudIcon } from 'lucide-svelte'
  import {
    Button,
    FileListItem,
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
    DialogClose
  } from '$components'
  import { createAssets } from '$lib/assets'
  import { addToast } from '$components/Toaster.svelte'

  export function open() {
    dialog.show()
  }

  export function close() {
    dialog.dissmis()
  }

  let fileInput: HTMLInputElement
  let files: { file: File; fileName: string; extension: string }[] = []
  let isSubmitting = false
  let dialog: Dialog

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

    const response = await createAssets(formData)
    if (!response.ok) {
      addToast({
        data: {
          title: 'Помилка',
          description: response.error,
          color: 'bg-red-500'
        }
      })
    }
    isSubmitting = false
  }

  function changeFileName(e: CustomEvent<{ i: number; fileName: string }>) {
    const { i, fileName } = e.detail
    files[i].fileName = fileName
    files = files
  }
</script>

<Dialog size="md">
  <DialogTrigger>
    <UploadCloudIcon slot="icon" size={16} />
    <svelte:fragment slot="text">Завантажити</svelte:fragment>
  </DialogTrigger>
  <DialogContent>
    <DialogTitle slot="title">Завантажити файли</DialogTitle>
    <DialogDescription slot="description">
      Будь ласка, оберіть файли для завантаження
    </DialogDescription>
    <DialogClose />
    <div class="min-h-[30px]">
      {#if files}
        <ul class="max-h-[400px] overflow-y-auto">
          {#each files as { file, fileName, extension }, index}
            <FileListItem
              {index}
              {extension}
              {fileName}
              src={URL.createObjectURL(file)}
              type={file.type}
              on:remove={removeFile}
              on:change={changeFileName}
            />
          {/each}
        </ul>
      {/if}
    </div>
    <div
      class="-mb-9 -ml-9 -mr-9 flex min-h-[80px] items-center justify-between gap-2.5 rounded-bl-lg rounded-br-lg bg-gray-100 px-9 lg:justify-end"
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
      <Button isLoading={isSubmitting} on:click={submit}>Завантажити</Button>
    </div>
  </DialogContent>
</Dialog>
