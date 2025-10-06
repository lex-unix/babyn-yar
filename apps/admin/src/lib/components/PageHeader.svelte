<script lang="ts">
  import type { Snippet } from 'svelte'
  import Heading from './Heading.svelte'
  import Divider from './Divider.svelte'

  type Props = {
    title: string
    children?: Snippet
  }
  let { title, children }: Props = $props()
</script>

<div class="mb-14">
  <div class="flex h-full w-full items-center justify-between">
    <Heading>
      {title}
    </Heading>
    {@render children?.()}
  </div>
  <Divider class="mt-6" />
</div>
