<script lang="ts">
  import type { Snippet } from 'svelte'

  type Props = {
    title: string
    children: Snippet
  }

  const { title, children }: Props = $props()
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

{@render children()}
