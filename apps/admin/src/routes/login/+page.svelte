<script lang="ts">
  import { login } from '$lib'
  import { user } from '$lib/stores'
  import { goto } from '$app/navigation'
  import { Button, Input } from '$components'

  let email: string
  let password: string
  let isSubmitting = false

  $: $user && goto('/content')

  async function submit() {
    const res = await login(email, password)
    if (res.ok) {
      $user = res.user
      goto('/')
    } else {
      console.log(res.error)
    }
  }
</script>

<div class="min-h-screen bg-gray-50 px-3 pt-10 text-gray-900">
  <form on:submit|preventDefault={submit} class="mx-auto max-w-md space-y-3">
    Email
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
    <div class="flex justify-center">
      <Button isLoading={isSubmitting}>Продовжити</Button>
    </div>
  </form>
</div>
