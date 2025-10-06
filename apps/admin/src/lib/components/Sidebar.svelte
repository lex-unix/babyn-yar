<script>
  import SidebarLink from './SidebarLink.svelte'
  import Image from 'phosphor-svelte/lib/Image'
  import Files from 'phosphor-svelte/lib/Files'
  import Users from 'phosphor-svelte/lib/Users'
  import GearSix from 'phosphor-svelte/lib/GearSix'
  import { getLoggedUserContext } from '$lib/context'

  const loggedUser = getLoggedUserContext()
</script>

<nav class="flex h-full min-h-0 flex-col">
  <div class="flex flex-1 flex-col overflow-y-auto p-4">
    <div class="flex flex-col gap-0.5">
      <SidebarLink href="/content">
        {#snippet icon()}
          <Files weight="fill" />
        {/snippet}
        Контент
      </SidebarLink>
      <SidebarLink href="/assets">
        {#snippet icon()}
          <Image weight="fill" />
        {/snippet}
        Медіа файли
      </SidebarLink>
      {#if loggedUser.permissions.includes('admin')}
        <SidebarLink href="/users">
          {#snippet icon()}
            <Users weight="fill" />
          {/snippet}
          Користувачі
        </SidebarLink>
      {/if}
      <SidebarLink href="/settings">
        {#snippet icon()}
          <GearSix weight="fill" />
        {/snippet}
        Налаштування
      </SidebarLink>
    </div>
  </div>
</nav>
