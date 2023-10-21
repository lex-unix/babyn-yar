<script lang="ts">
  import { Input } from '$components'
  import { melt, createDialog, createSelect } from '@melt-ui/svelte'
  import { ChevronDown, PlusIcon, XIcon } from 'lucide-svelte'
  import { createEventDispatcher } from 'svelte'

  export function openDialog() {
    open.set(true)
  }

  export function closeDialog() {
    open.set(false)
  }

  let fullName: string
  let email: string
  let password: string
  let isSubmitting = false

  async function register() {
    isSubmitting = true
    const permission = $selected?.value
    const body = JSON.stringify({ fullName, email, password, permission })
    const response = await fetch('http://localhost:8000/v1/users/register', {
      method: 'POST',
      credentials: 'include',
      body
    })

    const { user } = await response.json()
    dispatch('register', { user })

    isSubmitting = false
    open.set(false)

    reset()
  }

  function reset() {
    fullName = ''
    password = ''
    email = ''
  }

  const dispatch = createEventDispatcher()

  const permissionOptions = [
    { value: 'publisher', label: 'Автор' },
    { value: 'admin', label: 'Адміністратор' }
  ]

  const {
    elements: {
      trigger,
      portalled,
      content,
      overlay,
      title,
      description,
      close
    },
    states: { open }
  } = createDialog({ forceVisible: true })

  const {
    elements: { trigger: selectTrigger, menu, option },
    states: { selectedLabel, open: selectOpen, selected },
    helpers: { isSelected }
  } = createSelect({
    forceVisible: true,
    defaultSelected: { value: 'publisher', label: 'Автор' },
    positioning: {
      placement: 'bottom',
      fitViewport: true,
      sameWidth: true
    }
  })
</script>

<button
  use:melt={$trigger}
  class="flex items-center gap-3 rounded-md border border-teal-700/10 bg-teal-500 px-4 py-3 text-sm font-medium leading-none text-white outline-none focus:bg-teal-600"
>
  <span>Додати користувача</span>
  <PlusIcon size={16} />
</button>

<div use:melt={$portalled}>
  {#if $open}
    <div use:melt={$overlay} class="fixed inset-0 z-50 bg-black/50" />
    <div
      class="fixed inset-0 z-50 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden p-6"
    >
      <div
        use:melt={$content}
        class="relative min-w-[720px] max-w-[800px] rounded-lg bg-white p-9"
      >
        <div class="mb-5">
          <h2 use:melt={$title} class="text-xl font-semibold text-gray-700">
            Додати нового користувача
          </h2>
          <p use:melt={$description} class="mt-2 text-gray-400">
            Зареєструйте нового користувача, вказавши ім'я, адресу електронної
            пошти, пароль та роль. Користувач зможе потім змінити пароль у
            налаштуваннях.
          </p>
        </div>
        <form on:submit|preventDefault={register} class="space-y-3">
          <Input
            label="Повне ім'я"
            name="fullName"
            bind:value={fullName}
            required
          />
          <Input label="Email" name="email" bind:value={email} required />
          <Input
            label="Пароль"
            name="password"
            bind:value={password}
            required
          />
          <div>
            <label for="select-role" class="mb-1.5 block text-gray-400">
              Роль
            </label>
            <button
              use:melt={$selectTrigger}
              id="select-role"
              type="button"
              class="flex min-w-[220px] items-center justify-between rounded border bg-white px-3 py-2 leading-none outline-none hover:border-teal-400 focus:border-teal-400 focus:ring focus:ring-teal-100"
            >
              {$selectedLabel || 'Обрати роль'}
              <ChevronDown class="h-5 w-5" />
            </button>
          </div>
          {#if $selectOpen}
            <div
              use:melt={$menu}
              class="z-10 flex max-h-[300px] flex-col overflow-y-auto rounded border bg-white p-1"
            >
              {#each permissionOptions as { label, value }}
                <div
                  use:melt={$option({ value, label })}
                  class={`p-2 hover:cursor-pointer hover:bg-gray-400/10 ${
                    $isSelected(value) ? 'text-teal-500' : ''
                  }`}
                >
                  {label}
                </div>
              {/each}
            </div>
          {/if}
          <div class="flex justify-end pt-2">
            <button
              class="rounded-md bg-teal-500 px-4 py-3 font-medium leading-none text-white outline-none focus:bg-teal-600 disabled:opacity-60"
            >
              Додати
            </button>
          </div>
        </form>

        <button
          use:melt={$close}
          aria-label="Закрити"
          disabled={isSubmitting}
          class="absolute right-5 top-5 inline-flex items-center justify-center rounded-full p-1 text-gray-800 outline-none hover:bg-gray-100 focus:ring focus:ring-teal-300 disabled:opacity-60"
        >
          <XIcon size={16} />
        </button>
      </div>
    </div>
  {/if}
</div>