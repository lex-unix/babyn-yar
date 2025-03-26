<script lang="ts">
  import Label from '$components/Label.svelte'
  import PageHeader from '$components/PageHeader.svelte'
  import InputV2 from '$components/InputV2.svelte'
  import { currentUser } from '$lib/auth/store'
  import { useForm } from '$lib/form'
  import { ResponseError } from '$lib/response-error'
  import { useUpdateSettings } from '$lib/users/query'
  import { Settings } from '$lib/users/schema'
  import Field from '$components/Field.svelte'
  import ButtonV2 from '$components/ButtonV2.svelte'
  import FieldError from '$components/FieldError.svelte'

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

<div class="mx-auto my-20 max-w-md">
  <form class="flex flex-col gap-y-10" on:submit|preventDefault={handleSubmit}>
    <Field>
      <Label for="fullName">Повне ім&apos;я</Label>
      <InputV2
        id="fullName"
        bind:value={$values.fullName}
        invalid={!!$errors.fullName}
      />
      {#if $errors.fullName}
        <FieldError>{$errors.fullName}</FieldError>
      {/if}
    </Field>
    <Field>
      <Label for="email">Email</Label>
      <InputV2
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
      <InputV2
        id="password"
        name="passwrod"
        type="password"
        bind:value={$values.password}
        invalid={!!$errors.password}
      />
      {#if $errors.password}
        <FieldError>{$errors.password}</FieldError>
      {/if}
    </Field>
    <div class="self-end">
      <ButtonV2 disabled={$isSubmitting}>Зберегти зміни</ButtonV2>
    </div>
  </form>
</div>
