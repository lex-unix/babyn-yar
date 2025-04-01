<script lang="ts">
  import Button from '$components/ButtonV2.svelte'
  import Field from '$components/Field.svelte'
  import Label from '$components/Label.svelte'
  import Input from '$components/InputV2.svelte'
  import FieldError from '$components/FieldError.svelte'
  import { currentUser } from '$lib/auth/store'
  import { goto } from '$app/navigation'
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

<div class="flex w-full flex-col justify-center bg-white">
  <div class="px-6 py-12 lg:p-6">
    <div class="mx-auto w-full max-w-md">
      <h1 class="mb-8 text-center text-2xl/8 font-semibold sm:text-xl/8">
        Увійдіть у свій обліковий запис
      </h1>
      <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-6">
        <Field>
          <Label for="email">Email</Label>
          <Input
            id="email"
            bind:value={$values.email}
            invalid={!!$errors.email}
          />
          {#if $errors.email}
            <FieldError>{$errors.email}</FieldError>
          {/if}
        </Field>
        <Field>
          <Label for="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            bind:value={$values.password}
            invalid={!!$errors.password}
          />
          {#if $errors.password}
            <FieldError>{$errors.password}</FieldError>
          {/if}
        </Field>
        <Button disabled={$login.isPending}>Продовжити</Button>
      </form>
    </div>
  </div>
</div>
