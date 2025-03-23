<script>
  import '../app.css'
  import { Toaster } from '$components'
  import { QueryClientProvider } from '@tanstack/svelte-query'
  import { queryClient } from '$query/client'
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
</svelte:head>

<QueryClientProvider client={queryClient}>
  <div
    class="relative isolate flex min-h-svh w-full bg-white max-lg:flex-col lg:bg-zinc-100"
  >
    <slot />
  </div>
  <Toaster />
</QueryClientProvider>
