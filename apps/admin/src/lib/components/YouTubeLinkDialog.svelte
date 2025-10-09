<script lang="ts">
  import Button from './Button.svelte'
  import Dialog from './Dialog.svelte'
  import DialogActions from './DialogActions.svelte'
  import DialogBody from './DialogBody.svelte'
  import DialogClose from './DialogClose.svelte'
  import DialogDescription from './DialogDescription.svelte'
  import DialogTitle from './DialogTitle.svelte'
  import Field from './Field.svelte'
  import Input from './Input.svelte'
  import Label from './Label.svelte'

  type Props = {
    open: boolean
    onSelect: (link: string) => void
  }

  let { open = $bindable(), onSelect }: Props = $props()

  function handleSelect() {
    onSelect(link)
    link = ''
  }

  let link = $state('')
</script>

<Dialog bind:open>
  <DialogTitle>YouTube відео</DialogTitle>
  <DialogDescription>Додати посилання на YouTube відео</DialogDescription>
  <DialogBody>
    <Field>
      <Label for="youtube-link">Посилання</Label>
      <Input bind:value={link} id="youtube-link" />
    </Field>
    <DialogActions>
      <DialogClose />
      <Button disabled={link.length === 0} onclick={handleSelect}>
        Готово
      </Button>
    </DialogActions>
  </DialogBody>
</Dialog>
