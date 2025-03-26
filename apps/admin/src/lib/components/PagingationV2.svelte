<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import PaginationPrev from './PaginationPrev.svelte'
  import PaginationNext from './PaginationNext.svelte'
  import PaginationList from './PaginationList.svelte'
  import PaginationPage from './PaginationPage.svelte'
  import { cn } from '$lib/cn'

  let className = ''
  export { className as class }

  export let currentPage: number
  export let lastPage: number

  const delta = 3
  $: lower = Math.max(1, currentPage - delta)
  $: upper = Math.min(lastPage, currentPage + delta)
  $: pages = Array.from({ length: upper - lower + 1 }, (_, i) => i + lower)

  const dispatch = createEventDispatcher()

  function selectPage(page: number) {
    dispatch('select', { page })
  }

  function prev() {
    selectPage(currentPage - 1)
  }

  function next() {
    selectPage(currentPage + 1)
  }
</script>

<div class={cn('flex gap-x-2', className)}>
  <PaginationPrev disabled={currentPage === 1} on:click={prev} />
  <PaginationList>
    {#each pages as page}
      <PaginationPage
        on:click={() => selectPage(page)}
        active={currentPage === page}
      >
        {page}
      </PaginationPage>
    {/each}
  </PaginationList>
  <PaginationNext disabled={currentPage === lastPage} on:click={next} />
</div>
