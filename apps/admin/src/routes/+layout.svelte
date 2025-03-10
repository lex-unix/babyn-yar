<script>
  import '../app.css'
  import { Toaster } from '$components'
  import { QueryClientProvider } from '@tanstack/svelte-query'
  import { queryClient } from '$lib/query'
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
</svelte:head>

<QueryClientProvider client={queryClient}>
  <div class="isolate">
    <slot />
  </div>
  <Toaster />
</QueryClientProvider>
