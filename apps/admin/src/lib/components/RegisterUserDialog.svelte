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
  import { useRegister } from '$lib/auth/query'
  import { useForm } from '$lib/form'
  import { RegisterUser } from '$lib/auth/schema'
  import { ResponseError } from '$lib/response-error'

  export function open() {
    dialog.show()
  }

  export function close() {
    dialog.dissmis()
  }

  const register = useRegister()

  const { values, errors, isSubmitting, handleSubmit } = useForm({
    schema: RegisterUser,
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      permission: 'publisher'
    },
    onSubmit: async ({ value, reset }) => {
      try {
        await $register.mutateAsync(value)
        dialog.dissmis()
        reset()
      } catch (error) {
        if (error instanceof ResponseError && error.isFormError()) {
          errors.update(prev => ({ ...prev, ...error.formErrors }))
        }
      }
    }
  })

  let dialog: Dialog
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
    <form on:submit|preventDefault={handleSubmit} class="space-y-3">
      <Input
        label="Повне ім'я"
        name="fullName"
        bind:value={$values.fullName}
        error={$errors.fullName}
        required
      />
      <Input
        type="email"
        label="Email"
        name="email"
        bind:value={$values.email}
        error={$errors.email}
        required
      />
      <Input
        type="password"
        label="Пароль"
        name="password"
        bind:value={$values.password}
        error={$errors.password}
        required
      />
      <div>
        <label for="select-role" class="mb-1.5 block text-gray-400">
          Роль
        </label>
        <Select
          bind:selected={$values.permission}
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
          <Button isLoading={$isSubmitting}>Додати</Button>
        </div>
      </div>
    </form>
    <DialogClose isDisabled={$isSubmitting} />
  </DialogContent>
</Dialog>
