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
    DialogClose,
    Input
  } from '$components'
  import { useUploadAssets } from '$lib/assets/query'

  export function open() {
    dialog.show()
  }

  export function close() {
    dialog.dissmis()
  }

  let fileInput: HTMLInputElement
  let files: { file: File; fileName: string; extension: string }[] = []
  let filePrefix: string = ''
  let dialog: Dialog

  const uploadAssets = useUploadAssets()

  function addFiles(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement
    }
  ) {
    const input = e.currentTarget

    if (!input.files || input.files.length === 0) return

    const newFiles = Array.from(input.files).map(file => {
      const nameParts = file.name.split('.')
      const extension = nameParts.pop() || ''
      const baseName = nameParts.join('.')
      return {
        file,
        fileName: filePrefix + baseName,
        extension
      }
    })

    files = [...files, ...newFiles]
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
    if (files.length <= 0) return

    const formData = new FormData()
    files.forEach(({ file, fileName, extension }) => {
      const prefix = filePrefix ? filePrefix + '_' : ''
      const fullName = `${prefix}${fileName}.${extension}`
      formData.append('assets', file, fullName)
    })

    $uploadAssets.mutate(formData, {
      onSuccess: () => {
        filePrefix = ''
        files = []
        dialog.dissmis()
      }
    })
  }

  function changeFileName(e: CustomEvent<{ i: number; fileName: string }>) {
    const { i, fileName } = e.detail
    files[i].fileName = fileName
    files = files
  }
</script>

<Dialog bind:this={dialog} size="md">
  <DialogTrigger>
    <UploadCloudIcon slot="icon" size={16} />
    <svelte:fragment slot="text">Завантажити</svelte:fragment>
  </DialogTrigger>
  <DialogContent>
    <DialogTitle slot="title">Завантажити файли</DialogTitle>
    <DialogDescription slot="description">
      Будь ласка, оберіть файли для завантаження. Ви також можете додати префікс
      до усіх файлів одночасно, щоб їх було легше організувати і шукати. Просто
      введіть префікс у поле.
    </DialogDescription>
    <DialogClose />
    <div class="mb-3 md:mb-5">
      <Input bind:value={filePrefix} label="Префікс" name="filePrefix" />
    </div>
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
      class="-mx-5 -mb-5 flex min-h-[80px] items-center justify-between gap-2.5 rounded-br-lg rounded-bl-lg bg-gray-100 px-9 lg:-mx-9 lg:-mb-9 lg:justify-end"
    >
      <input
        type="file"
        hidden
        bind:this={fileInput}
        multiple
        on:change={addFiles}
      />
      <button
        class="rounded-md border bg-white px-4 py-3 leading-none font-medium outline-none focus:ring focus:ring-gray-300 disabled:opacity-60"
        disabled={$uploadAssets.isPending}
        on:click={openFileBrowser}
      >
        Додати файл
      </button>
      <Button isLoading={$uploadAssets.isPending} on:click={submit}>
        Завантажити
      </Button>
    </div>
  </DialogContent>
</Dialog>
