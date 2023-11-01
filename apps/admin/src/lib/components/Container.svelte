<script lang="ts">
  export let title: string
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="mt-20 px-3">
  <div class="pt-5">
    <slot />
  </div>
</div>
