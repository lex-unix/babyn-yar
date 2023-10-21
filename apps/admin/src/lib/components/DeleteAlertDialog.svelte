<script lang="ts">
  import { melt, createDialog } from '@melt-ui/svelte'
  import { X } from 'lucide-svelte'
  import { createEventDispatcher } from 'svelte'

  export function closeAlertDialog() {
    open.set(false)
  }

  export function openAlertDialog() {
    open.set(true)
  }

  function confirm() {
    dispatch('confirm')
  }

  const dispatch = createEventDispatcher()

  const {
    elements: { overlay, content, title, description, close, portalled },
    states: { open }
  } = createDialog({ role: 'alertdialog' })
</script>

<div use:melt={$portalled}>
  {#if $open}
    <div use:melt={$overlay} class="fixed inset-0 z-50 bg-black/50">
      <div
        class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-6"
      >
        <div
          use:melt={$content}
          class="relative m-auto max-h-[85vh] w-[90vw] max-w-[450px] rounded-lg bg-white p-6"
        >
          <h2 use:melt={$title} class="m-0 text-lg font-medium text-black">
            Ви впевнені, що хочете це видалити?
          </h2>
          <p
            use:melt={$description}
            class="mb-5 mt-2 leading-normal text-zinc-600"
          >
            Цю дію не можна скасувати. Це остаточно видалить обрані елементи.
          </p>

          <div class="mt-6 flex justify-end gap-4">
            <button
              use:melt={$close}
              class="inline-flex h-8 items-center justify-center rounded-[4px] bg-gray-100 px-4 font-medium leading-none text-gray-600"
            >
              Відмінити
            </button>
            <button
              on:click={confirm}
              class="inline-flex h-8 items-center justify-center rounded bg-red-600 px-4 font-medium leading-none text-red-50"
            >
              Видалити
            </button>
          </div>

          <button
            class="absolute right-3 top-3 inline-flex h-7 w-7 appearance-none items-center justify-center rounded-full p-1 text-gray-800 outline-none hover:bg-gray-100 focus:ring focus:ring-teal-300"
            use:melt={$close}
            aria-label="Закрити"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
