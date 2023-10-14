<script>
  import { Sidebar, Toaster, SidebarLink, SidebarLinkLabel } from '$components'
  import { Layers, Image, Cog } from 'lucide-svelte'
</script>

<div class="flex h-screen bg-gray-50 text-gray-900">
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
  </Sidebar>
  <div class="flex-1 overflow-y-auto overflow-x-hidden px-5 py-10">
    <slot />
  </div>
</div>

<Toaster />
