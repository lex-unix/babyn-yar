<script lang="ts">
  import { Input, PageHeader, Container, Button } from '$components'
  import { addToast } from '$components/Toaster.svelte'
  import { updateUser } from '$lib'
  import { user } from '$lib/stores'
  import type { UserErrorResponse } from '$lib/types'

  let fullName: string = $user?.fullName as string
  let email: string = $user?.email as string
  let password: string
  let isSubmitting = false
  let errors: UserErrorResponse | undefined = undefined

  async function submit() {
    isSubmitting = true
    const res = await updateUser(fullName, email, password)
    if (res.ok) {
      $user = res.user
      isSubmitting = false
      return
    }
    if (res.status && res.status === 422) {
      errors = res.error
    } else {
      addToast({
        data: {
          title: 'Помилка!',
          description: res.error,
          color: ''
        }
      })
    }
    isSubmitting = false
  }
</script>

<PageHeader>
  <svelte:fragment slot="heading">Налаштування</svelte:fragment>
</PageHeader>

<Container title="Налаштування">
  <form on:submit|preventDefault={submit} class="space-y-3">
    <Input
      bind:value={fullName}
      label="Повне ім'я"
      name="fullName"
      error={errors?.fullName}
    />
    <Input
      bind:value={email}
      type="email"
      label="Email"
      name="email"
      error={errors?.email}
    />
    <Input
      bind:value={password}
      type="password"
      label="Новий пароль"
      name="password"
      error={errors?.password}
    />
    <Button isLoading={isSubmitting}>Зберегти зміни</Button>
  </form>
</Container>
