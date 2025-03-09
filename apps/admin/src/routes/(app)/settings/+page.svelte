<script lang="ts">
  import { Input, PageHeader, Container, Button } from '$components'
  import { addToast } from '$components/Toaster.svelte'
  import { user } from '$lib/stores'
  import { createUserSettingsMutation } from '$lib/query'
  import { TOAST } from '$lib/toast-messages'

  let fullName: string = $user?.fullName as string
  let email: string = $user?.email as string
  let password: string

  const mutation = createUserSettingsMutation()

  async function submit() {
    $mutation.mutate(
      { fullName, email, password },
      {
        onSuccess: () => addToast(TOAST.UPDATE_SETTINGS_SUCCESS),
        onError: () => addToast(TOAST.UPDATE_SETTINGS_ERROR)
      }
    )
  }
</script>

<PageHeader>
  <svelte:fragment slot="heading">Налаштування</svelte:fragment>
</PageHeader>

<Container title="Налаштування">
  <div class="flex flex-col items-center">
    <div class="mx-auto w-full max-w-xl">
      <div class="rounded-md border bg-white p-6 shadow md:p-12">
        <form on:submit|preventDefault={submit} class="space-y-5">
          <Input bind:value={fullName} label="Повне ім'я" name="fullName" />
          <Input
            bind:value={email}
            type="email"
            label="Email"
            name="email"
            error={$mutation.isError && $mutation.error.isFormError()
              ? $mutation.error.error.email
              : undefined}
          />
          <Input
            bind:value={password}
            type="password"
            label="Новий пароль"
            name="password"
            error={$mutation.isError && $mutation.error.isFormError()
              ? $mutation.error.error.password
              : undefined}
          />
          <Button isLoading={$mutation.isPending} class="w-full justify-center">
            Зберегти зміни
          </Button>
        </form>
      </div>
    </div>
  </div>
</Container>
