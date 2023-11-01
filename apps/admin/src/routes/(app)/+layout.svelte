<script>
  import { goto } from '$app/navigation'
  import {
    Sidebar,
    MobileHeader,
    Toaster,
    SidebarLink,
    SidebarLinkLabel
  } from '$components'
  import { user } from '$lib/stores'
  import { Layers, Image, Cog, Users2 } from 'lucide-svelte'
  import { onMount } from 'svelte'
  import { admin } from '$lib/stores'

  onMount(() => {
    !$user && goto('/login')
  })
</script>

<div class="h-screen bg-gray-50 text-gray-900">
  <MobileHeader />
  <div class="flex h-full">
    <Sidebar>
      <SidebarLink href="/content">
        <Layers size={20} class="min-w-[20px]" />
        <SidebarLinkLabel>Контент</SidebarLinkLabel>
      </SidebarLink>
      <SidebarLink href="/assets">
        <Image size={20} class="min-w-[20px]" />
        <SidebarLinkLabel>Медіа файли</SidebarLinkLabel>
      </SidebarLink>
      <SidebarLink href="/settings">
        <Cog size={20} class="min-w-[20px]" />
        <SidebarLinkLabel>Налаштування</SidebarLinkLabel>
      </SidebarLink>
      {#if $admin}
        <SidebarLink href="/users">
          <Users2 size={20} class="min-w-[20px]" />
          <SidebarLinkLabel>Користувачі</SidebarLinkLabel>
        </SidebarLink>
      {/if}
    </Sidebar>
    <div class="flex-1 overflow-y-auto overflow-x-hidden">
      <slot />
    </div>
  </div>
</div>

<Toaster />
