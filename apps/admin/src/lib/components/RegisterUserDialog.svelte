<script lang="ts">
  import {
    Input,
    Button,
    Select,
    SelectTrigger,
    SelectMenu,
    SelectItem,
    Dialog,
    DialogTrigger,
    DialogClose,
    DialogTitle,
    DialogDescription,
    DialogContent
  } from '$components'
  import { PlusIcon } from 'lucide-svelte'
  import { createEventDispatcher } from 'svelte'
  import { permissionOptions } from '$lib'

  export function open() {
    dialog.show()
  }

  export function close() {
    dialog.dissmis()
  }

  let fullName: string
  let email: string
  let password: string
  let permission: string
  let isSubmitting = false
  let dialog: Dialog

  const dispatch = createEventDispatcher()

  async function register() {
    isSubmitting = true
    const body = JSON.stringify({ fullName, email, password, permission })
    const response = await fetch('http://localhost:8000/v1/users/register', {
      method: 'POST',
      credentials: 'include',
      body
    })

    const { user } = await response.json()
    dispatch('register', { user })

    isSubmitting = false
    dialog.dissmis()

    reset()
  }

  function reset() {
    fullName = ''
    password = ''
    email = ''
  }
</script>

<Dialog bind:this={dialog}>
  <DialogTrigger>
    <svelte:fragment slot="text">Додати</svelte:fragment>
    <PlusIcon slot="icon" size={16} />
  </DialogTrigger>
  <DialogContent>
    <DialogTitle slot="title">Додати нового користувача</DialogTitle>
    <DialogDescription slot="description">
      Зареєструйте нового користувача, вказавши ім'я, адресу електронної пошти,
      пароль та роль. Користувач зможе потім змінити пароль у налаштуваннях.
    </DialogDescription>
    <form on:submit|preventDefault={register} class="space-y-3">
      <Input
        label="Повне ім'я"
        name="fullName"
        bind:value={fullName}
        required
      />
      <Input
        type="email"
        label="Email"
        name="email"
        bind:value={email}
        required
      />
      <Input
        type="password"
        label="Пароль"
        name="password"
        bind:value={password}
        required
      />
      <div>
        <label for="select-role" class="mb-1.5 block text-gray-400">
          Роль
        </label>
        <Select
          bind:selected={permission}
          defaultSelected={permissionOptions[0]}
        >
          <SelectTrigger id="select-role">Обрати роль</SelectTrigger>
          <SelectMenu>
            {#each permissionOptions as { value, label }}
              <SelectItem {value} {label} />
            {/each}
          </SelectMenu>
        </Select>
        <div class="flex justify-end pt-2">
          <Button isLoading={false}>Додати</Button>
        </div>
      </div>
    </form>
    <DialogClose isDisabled={isSubmitting} />
  </DialogContent>
</Dialog>
