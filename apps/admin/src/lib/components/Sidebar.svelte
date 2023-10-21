<script lang="ts">
  import { UserCircle2 } from 'lucide-svelte'
  import { user } from '$lib/stores'
</script>

<aside
  class="min-h-full w-[280px] max-w-[80px] bg-gray-900 transition-[max-width] lg:max-w-[280px]"
>
  <div class="flex min-h-full flex-col px-4">
    <ul class="pt-10 lg:w-full">
      <slot />
    </ul>
    {#if $user}
      <div class="relative mb-4 mt-auto">
        <p
          class="inline-flex w-full items-center justify-center gap-3 text-sm text-gray-400"
        >
          <UserCircle2 size={20} />
          <span class="font-semibold">
            {$user.fullName}
          </span>
        </p>
      </div>
    {/if}
  </div>
</aside>
