<script lang="ts">
  import { Input } from '$components'
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

<div class="mb-4">
  <h1 class="text-xl font-semibold">Налаштування користувача</h1>
</div>

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
    label="Пароль"
    name="password"
    error={errors?.password}
  />
  <button
    class="flex items-center gap-3 rounded-md border border-teal-700/10 bg-teal-500 px-4 py-3 font-medium leading-none text-white outline-none focus:bg-teal-600 disabled:opacity-60"
    disabled={isSubmitting}
  >
    Зберегти зміни
  </button>
</form>
