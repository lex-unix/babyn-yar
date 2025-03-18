<script lang="ts">
  import { Input, PageHeader, Container, Button } from '$components'
  import { currentUser } from '$lib/auth/store'
  import { useUpdateSettings } from '$lib/users/query'

  let fullName: string = $currentUser?.fullName as string
  let email: string = $currentUser?.email as string
  let password: string

  const updateSettigs = useUpdateSettings()

  function submit() {
    $updateSettigs.mutate({ fullName, email, password })
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
            error={$updateSettigs.isError && $updateSettigs.error.isFormError()
              ? $updateSettigs.error.error.email
              : undefined}
          />
          <Input
            bind:value={password}
            type="password"
            label="Новий пароль"
            name="password"
            error={$updateSettigs.isError && $updateSettigs.error.isFormError()
              ? $updateSettigs.error.error.password
              : undefined}
          />
          <Button
            isLoading={$updateSettigs.isPending}
            class="w-full justify-center"
          >
            Зберегти зміни
          </Button>
        </form>
      </div>
    </div>
  </div>
</Container>
