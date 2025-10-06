<script lang="ts">
  import type { Snippet } from 'svelte'
  import Divider from './Divider.svelte'
  import Heading from './Heading.svelte'

  type Props = {
    heading: string
    children: Snippet
  }

  let { heading, children }: Props = $props()
</script>

<Heading>{heading}</Heading>

{@render children()}

<Divider class="mt-10 mb-6" />
