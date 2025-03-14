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
  import { permissionOptions } from '$lib/select-options'
  import { addToast } from './Toaster.svelte'
  import { useRegister } from '$query/auth'
  import { TOAST } from '$lib/toast-messages'

  export function open() {
    dialog.show()
  }

  export function close() {
    dialog.dissmis()
  }

  const register = useRegister()

  let fullName: string
  let email: string
  let password: string
  let permission: string
  let dialog: Dialog

  async function submit() {
    $register.mutate(
      { fullName, email, password, permission },
      {
        onSuccess: () => {
          reset()
          dialog.dissmis()
          addToast(TOAST.REGISTER_SUCCESS)
        }
      }
    )
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
    <form on:submit|preventDefault={submit} class="space-y-3">
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
        error={$register.isError && $register.error.isFormError()
          ? $register.error.error.email
          : undefined}
        required
      />
      <Input
        type="password"
        label="Пароль"
        name="password"
        bind:value={password}
        error={$register.isError && $register.error.isFormError()
          ? $register.error.error.password
          : undefined}
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
          <SelectTrigger>Обрати роль</SelectTrigger>
          <SelectMenu class="z-[100]">
            {#each permissionOptions as { value, label }}
              <SelectItem {value} {label} />
            {/each}
          </SelectMenu>
        </Select>
        <div class="flex justify-end pt-2">
          <Button isLoading={$register.isPending}>Додати</Button>
        </div>
      </div>
    </form>
    <DialogClose isDisabled={$register.isPending} />
  </DialogContent>
</Dialog>
