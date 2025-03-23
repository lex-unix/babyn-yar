<script lang="ts">
  import { createDialog, melt } from '@melt-ui/svelte'
  import { fade, fly } from 'svelte/transition'
  import Sidebar from './Sidebar.svelte'
  import Button from './ButtonV2.svelte'
  import { MenuIcon, XIcon } from 'lucide-svelte'
  import { isMobileDrawerOpen } from '$lib/stores'

  const {
    elements: { trigger, overlay, content, close, portalled },
    states: { open }
  } = createDialog({
    forceVisible: true,
    open: isMobileDrawerOpen
  })
</script>

<Button plain use={[$trigger.action]} {...$trigger}>
  <MenuIcon slot="icon" />
</Button>
{#if $open}
  <div class="" use:melt={$portalled}>
    <div
      use:melt={$overlay}
      class="fixed inset-0 bg-black/30"
      transition:fade={{ duration: 150 }}
    ></div>
    <div
      use:melt={$content}
      class="fixed inset-y-0 w-full max-w-80 p-2"
      transition:fly={{
        x: -350,
        duration: 300,
        opacity: 1
      }}
    >
      <div
        class="flex h-full flex-col rounded-lg bg-white shadow-xs ring-1 ring-zinc-950/5"
      >
        <div class="mb-2 px-4 pt-3">
          <Button plain use={[$close.action]} {...$close} aria-label="Close">
            <XIcon slot="icon" />
          </Button>
        </div>
        <Sidebar />
      </div>
    </div>
  </div>
{/if}
