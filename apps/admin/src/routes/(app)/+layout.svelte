<script lang="ts">
  import { goto } from '$app/navigation'
  import { scrollContainer } from '$lib/stores'
  import { useLoggedUser } from '$lib/auth/query'
  import { currentUser } from '$lib/auth/store'
  import { ResponseError } from '$lib/response-error'
  import Sidebar from '$components/Sidebar.svelte'
  import MobileDrawer from '$components/MobileDrawer.svelte'

  let containerRef: HTMLElement | undefined = undefined
  $: if (containerRef) scrollContainer.set(containerRef)

  const loggedUser = useLoggedUser()

  $: $loggedUser.isError &&
    $loggedUser.error instanceof ResponseError &&
    $loggedUser.error.isUnauthorized() &&
    goto('/login')

  $: if ($loggedUser.isSuccess) {
    $currentUser = $loggedUser.data.user
  }
</script>

{#if $loggedUser.isSuccess}
  <div class="fixed inset-y-0 left-0 w-64 max-lg:hidden">
    <Sidebar />
  </div>
  <header class="flex items-center px-4 lg:hidden">
    <div class="py-2.5">
      <MobileDrawer />
    </div>
  </header>
  <main class="flex flex-1 flex-col pb-2 lg:min-w-0 lg:pt-2 lg:pr-2 lg:pl-64">
    <div
      class="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5"
    >
      <div class="mx-auto max-w-6xl">
        <slot />
      </div>
    </div>
  </main>
{/if}
