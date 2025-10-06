<script lang="ts">
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { useLoggedUser } from '$lib/auth/query'
  import { setLoggedUserContext } from '$lib/context'

  let { children } = $props()

  const user = useLoggedUser()

  setLoggedUserContext(() => user.data?.user)

  $effect(() => {
    if (user.isError || (!user.data && user.isSuccess)) {
      goto(resolve('/login'))
    }
  })
</script>

{#if user.data}
  {@render children()}
{/if}
