<script>
  import '../app.css'
  import { Sidebar, SidebarLink, SidebarLinkLabel } from '$components'
  import { Layers, Image, Cog } from 'lucide-svelte'
</script>

<div class="flex bg-gray-50 text-gray-900">
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
  <slot />
</div>
