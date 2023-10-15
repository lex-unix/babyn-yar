<script>
  import { onMount } from 'svelte'
  import '../app.css'
  import { PUBLIC_API_URL } from '$env/static/public'
  import { user } from '$lib/stores'

  let blocked = true

  onMount(async () => {
    const url = PUBLIC_API_URL + '/users/me'
    const response = await fetch(url, { credentials: 'include' })
    if (response.ok) {
      const json = await response.json()
      $user = json.user
    }
    blocked = false
  })
</script>

{#if !blocked}
  <slot />
{/if}
