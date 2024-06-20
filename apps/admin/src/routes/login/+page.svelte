<script lang="ts">
  import { login } from '$lib/api-utils'
  import { user } from '$lib/stores'
  import { goto } from '$app/navigation'
  import { Button, Input } from '$components'
  import { addToast } from '$components/Toaster.svelte'
  import { invalidCredentialsMsg, serverErrorMsg } from '$lib/toast-messages'

  let email: string
  let password: string
  let isSubmitting = false

  $: $user && goto('/content')

  async function submit() {
    isSubmitting = true
    const res = await login(JSON.stringify({ email, password }))
    if (res.ok) {
      $user = res.data.user
      goto('/')
    } else if (res.error.isUnauthorized()) {
      addToast(invalidCredentialsMsg)
    } else if (res.error.isServerError()) {
      addToast(serverErrorMsg)
    }
    isSubmitting = false
  }
</script>

<div class="flex min-h-screen flex-col bg-gray-50 text-gray-900">
  <div class="flex flex-1 flex-col justify-center">
    <div class="mx-auto w-full max-w-[28rem]">
      <h2 class="text-center text-2xl font-bold tracking-tight">
        Увійдіть у свій обліковий запис
      </h2>
    </div>
    <div class="mx-auto mt-10 w-full max-w-md">
      <div class="rounded-lg border bg-white p-6 shadow md:p-12">
        <form
          on:submit|preventDefault={submit}
          class="mx-auto max-w-md space-y-6"
        >
          <Input
            name="email"
            type="email"
            label="Email"
            bind:value={email}
            required
          />
          <Input
            name="password"
            type="password"
            label="Пароль"
            bind:value={password}
            required
          />
          <Button isLoading={isSubmitting} class="w-full justify-center">
            Продовжити
          </Button>
        </form>
      </div>
    </div>
  </div>
</div>
