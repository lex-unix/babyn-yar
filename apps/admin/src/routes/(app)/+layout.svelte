<script lang="ts">
  import { goto } from '$app/navigation'
  import {
    Sidebar,
    MobileHeader,
    SidebarLink,
    SidebarLinkLabel
  } from '$components'
  import { user } from '$lib/stores'
  import { Layers, Image, Cog, Users2 } from 'lucide-svelte'
  import { admin, scrollContainer } from '$lib/stores'
  import { useMe } from '$query/users'

  let containerRef: HTMLElement | undefined = undefined
  $: if (containerRef) scrollContainer.set(containerRef)

  const me = useMe()

  $: $me.isError && $me.error.isUnauthorized() && goto('/login')
  $: if ($me.isSuccess) {
    $user = $me.data.user
  }

  const links = [
    {
      text: 'Контент',
      href: '/content',
      icon: Layers
    },
    {
      text: 'Медіа файли',
      href: '/assets',
      icon: Image
    },
    {
      text: 'Налаштування',
      href: '/settings',
      icon: Cog
    }
  ]
</script>

{#if $me.isSuccess}
  <div class="h-screen bg-gray-50 text-gray-900">
    <MobileHeader />
    <div class="flex h-full">
      <Sidebar>
        {#each links as { text, href, icon }}
          <SidebarLink {href}>
            <svelte:component
              this={icon}
              class="min-w-[20px] group-data-[active=true]:text-indigo-700"
              size={20}
            />
            <SidebarLinkLabel>{text}</SidebarLinkLabel>
          </SidebarLink>
        {/each}
        {#if $admin}
          <SidebarLink href="/users">
            <Users2
              size={20}
              class="min-w-[20px] group-data-[active=true]:text-indigo-700"
            />
            <SidebarLinkLabel>Користувачі</SidebarLinkLabel>
          </SidebarLink>
        {/if}
      </Sidebar>
      <div
        bind:this={containerRef}
        class="flex-1 overflow-y-auto overflow-x-hidden"
        id="scrollable-container"
      >
        <slot />
      </div>
    </div>
  </div>
{/if}
