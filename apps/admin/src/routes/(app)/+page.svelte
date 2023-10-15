<script>
  import { user } from '$lib/stores'
</script>

<div class="h-full p-10">
  <h1 class="text-3xl font-bold">Welcome to SvelteKit</h1>
  <p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
  </p>
  <h1>{JSON.stringify($user)}</h1>
</div>
