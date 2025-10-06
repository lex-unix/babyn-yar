<script lang="ts">
  import { Checkbox } from 'bits-ui'

  type Props = {
    checked?: boolean
    value?: string
    disabled?: boolean
    required?: boolean
    onChange?: () => void
  }

  let {
    checked = $bindable(false),
    value = '',
    required = false,
    disabled = false,
    onChange
  }: Props = $props()
</script>

<Checkbox.Root
  bind:checked
  {disabled}
  {value}
  {required}
  onCheckedChange={onChange}
  class="group inline-flex focus:outline-none"
>
  <span
    class="relative isolate size-5 items-center justify-center rounded-sm border border-zinc-950/15 group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-blue-500
    group-data-disabled:bg-zinc-950/5 group-data-disabled:opacity-50 group-data-[state=checked]:border-transparent before:absolute before:inset-0 before:-z-10 before:rounded-sm before:bg-white before:shadow-sm
    group-data-disabled:before:bg-transparent group-data-[state=checked]:before:bg-zinc-900
    after:absolute after:inset-0 after:rounded-sm after:shadow-[inset_0_1px_--theme(--color-white/15%)] sm:size-4"
  >
    <svg
      class="size-4 stroke-white opacity-0 group-data-disabled:stroke-zinc-950/50 group-data-[state=checked]:opacity-100 sm:h-3.5 sm:w-3.5"
      viewBox="0 0 14 14"
      fill="none"
      ><path
        class="opacity-100"
        d="M3 8L6 11L11 3.5"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
  </span>
</Checkbox.Root>
