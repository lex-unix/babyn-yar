<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import {
    Button,
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    Input
  } from '$components'

  export function open() {
    dialog.show()
  }

  export function close() {
    dialog.dissmis()
  }

  let link: string = ''
  let dialog: Dialog

  const dispatch = createEventDispatcher()

  function done() {
    dispatch('done', { link })
    link = ''
  }
</script>

<Dialog bind:this={dialog} size="sm">
  <DialogContent>
    <DialogTitle slot="title">YouTube відео</DialogTitle>
    <DialogDescription slot="description">
      Додати посилання на YouTube відео
    </DialogDescription>
    <div class="pb-5">
      <Input bind:value={link} type="text" label="Посилання" name="link" />
    </div>
    <div
      class="-mb-6 -ml-3 -mr-3 flex min-h-[80px] items-center justify-end gap-2.5 rounded-bl-lg rounded-br-lg bg-gray-100 px-6 lg:-ml-6 lg:-mr-6"
    >
      <button
        on:click={() => dialog.dissmis()}
        class="rounded-md border bg-white px-4 py-3 text-sm font-semibold leading-none outline-none focus:ring focus:ring-gray-300 disabled:opacity-60"
      >
        Відмінити
      </button>
      <Button isDisabled={link.length === 0} on:click={done}>Готово</Button>
    </div>
    <DialogClose />
  </DialogContent>
</Dialog>
