<script lang="ts">
  import { login } from '$lib'
  import { user } from '$lib/stores'
  import { goto } from '$app/navigation'

  let email: string
  let password: string
  let submitting = false

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

<div class="min-h-screen bg-gray-50 pt-10 text-gray-900">
  <form on:submit|preventDefault={submit} class="mx-auto max-w-md space-y-3">
    <label class="block text-gray-400">
      Email
      <input
        name="email"
        type="email"
        bind:value={email}
        required
        class="mt-1.5 block h-10 w-full rounded border px-2 text-base text-gray-900 outline-none hover:border-teal-400 focus:border-teal-400 focus:ring focus:ring-teal-100"
      />
    </label>
    <label class="block text-gray-400">
      Пароль
      <input
        name="password"
        type="password"
        bind:value={password}
        required
        class="mt-1.5 block h-10 w-full rounded border px-2 text-base text-gray-900 outline-none hover:border-teal-400 focus:border-teal-400 focus:ring focus:ring-teal-100"
      />
    </label>
    <div class="flex justify-center">
      <button
        class="rounded-md border border-teal-700/10 bg-teal-500 px-4 py-2 font-medium text-white disabled:opacity-70"
        disabled={submitting}
      >
        Продовжити
      </button>
    </div>
  </form>
</div>
