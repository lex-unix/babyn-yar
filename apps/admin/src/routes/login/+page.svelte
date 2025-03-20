<script lang="ts">
  import { currentUser } from '$lib/auth/store'
  import { goto } from '$app/navigation'
  import { Button, Input } from '$components'
  import { useLoggedUser, useLogin } from '$lib/auth/query'
  import { useForm } from '$lib/form'
  import { Login } from '$lib/auth/schema'

  const loggedUser = useLoggedUser()
  const login = useLogin()

  const { values, errors, handleSubmit } = useForm({
    schema: Login,
    defaultValues: {
      email: '',
      password: ''
    },
    onSubmit: async ({ value }) => {
      $login.mutate(value)
    }
  })

  $: ($currentUser || $loggedUser.isSuccess) && goto('/content')
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
          on:submit|preventDefault={handleSubmit}
          class="mx-auto max-w-md space-y-6"
        >
          <Input
            name="email"
            type="email"
            label="Email"
            bind:value={$values.email}
            error={$errors.email}
            required
          />
          <Input
            name="password"
            type="password"
            label="Пароль"
            bind:value={$values.password}
            error={$errors.password}
            required
          />
          <Button isLoading={$login.isPending} class="w-full justify-center">
            Продовжити
          </Button>
        </form>
      </div>
    </div>
  </div>
</div>
