<script lang="ts">
  import { Input, PageHeader, Container, Button } from '$components'
  import { currentUser } from '$lib/auth/store'
  import { useForm } from '$lib/form'
  import { ResponseError } from '$lib/response-error'
  import { useUpdateSettings } from '$lib/users/query'
  import { Settings } from '$lib/users/schema'

  const updateSettigs = useUpdateSettings()

  const { values, errors, isSubmitting, handleSubmit } = useForm({
    schema: Settings,
    defaultValues: {
      fullName: $currentUser?.fullName ?? '',
      email: $currentUser?.email ?? '',
      password: undefined
    },
    onSubmit: async ({ value }) => {
      try {
        await $updateSettigs.mutateAsync(value)
      } catch (error) {
        if (error instanceof ResponseError && error.isFormError()) {
          errors.update(prev => ({ ...prev, ...error.formErrors }))
        }
      }
    }
  })
</script>

<PageHeader>
  <svelte:fragment slot="heading">Налаштування</svelte:fragment>
</PageHeader>

<Container title="Налаштування">
  <div class="flex flex-col items-center">
    <div class="mx-auto w-full max-w-xl">
      <div class="rounded-md border bg-white p-6 shadow md:p-12">
        <form on:submit|preventDefault={handleSubmit} class="space-y-5">
          <Input
            bind:value={$values.fullName}
            label="Повне ім'я"
            name="fullName"
            error={$errors.fullName}
          />
          <Input
            bind:value={$values.email}
            type="email"
            label="Email"
            name="email"
            error={$errors.email}
          />
          <Input
            bind:value={$values.password}
            type="password"
            label="Новий пароль"
            name="password"
            error={$errors.password}
          />
          <Button isLoading={$isSubmitting} class="w-full justify-center">
            Зберегти зміни
          </Button>
        </form>
      </div>
    </div>
  </div>
</Container>
