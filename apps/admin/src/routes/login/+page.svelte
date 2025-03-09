<script lang="ts">
  import { user } from '$lib/stores'
  import { goto } from '$app/navigation'
  import { Button, Input } from '$components'
  import { addToast } from '$components/Toaster.svelte'
  import { TOAST } from '$lib/toast-messages'
  import { craeteLoginMutation, createMeQuery } from '$lib/query'

  let email: string
  let password: string

  const query = createMeQuery()
  const mutation = craeteLoginMutation()

  $: ($user || $query.isSuccess) && goto('/content')

  async function submit() {
    $mutation.mutate(
      { email, password },
      {
        onSuccess: data => {
          $user = data.user
          goto('/content')
        },
        onError: error => {
          if (error.isUnauthorized()) {
            addToast(TOAST.CREDENTIALS_ERROR)
          } else if (error.isServerError()) {
            addToast(TOAST.SERVER_ERROR)
          }
        }
      }
    )
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
          <Button isLoading={$mutation.isPending} class="w-full justify-center">
            Продовжити
          </Button>
        </form>
      </div>
    </div>
  </div>
</div>
