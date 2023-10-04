<script lang="ts">
  import { melt, createDialog } from '@melt-ui/svelte'
  import { createEventDispatcher } from 'svelte'
  import { LinkOptionsMenu } from '$components'

  export function openDialog() {
    open.set(true)
  }

  export function closeDialog() {
    open.set(false)
  }

  export let value = ''
  let type = ''

  const dispatch = createEventDispatcher()

  const {
    elements: { portalled, overlay, content, title, description, close },
    states: { open }
  } = createDialog({
    closeOnOutsideClick: true
  })

  function done() {
    dispatch('done', { value, type })
    value = ''
  }

  function selectType(e: CustomEvent<string>) {
    type = e.detail
  }
</script>

<div use:melt={$portalled}>
  {#if $open}
    <div use:melt={$overlay} class="fixed inset-0 z-50 bg-black/50" />
    <div
      class="fixed inset-0 z-50 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden p-6 shadow-lg"
    >
      <div
        use:melt={$content}
        class="m-auto min-w-[620px] max-w-[700px] rounded-lg bg-white p-9"
      >
        <div class="mb-5">
          <h2 use:melt={$title} class="text-xl font-semibold text-gray-900">
            Посилання
          </h2>
          <p
            use:melt={$description}
            class="mb-5 mt-2 leading-normal text-gray-500"
          >
            Додати будь-яке посилання
          </p>
        </div>
        <div class="min-h-[30px]">
          <div class="pb-5">
            <div class="relative h-full">
              <div
                class="flex h-10 w-full items-center overflow-hidden rounded border px-4 hover:border-teal-400"
              >
                <div
                  class="inline-flex items-center border-r border-gray-700/20 pr-2"
                >
                  <LinkOptionsMenu on:select={selectType} />
                </div>
                <input
                  type="text"
                  name="link-variant"
                  bind:value
                  class="h-full w-full border-none pl-4 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          class="-mb-9 -ml-9 -mr-9 flex min-h-[80px] items-center justify-end gap-2.5 rounded-bl-lg rounded-br-lg bg-gray-100 px-9"
        >
          <button
            use:melt={$close}
            class="rounded-md border bg-white px-4 py-3 font-medium leading-none outline-none focus:ring focus:ring-gray-300 disabled:opacity-60"
          >
            Відмінити
          </button>
          <button
            disabled={value.length === 0}
            on:click={done}
            class="rounded-md bg-teal-500 px-4 py-3 font-medium leading-none text-white outline-none focus:bg-teal-600 disabled:opacity-60"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
