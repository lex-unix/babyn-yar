<div
  class="fixed h-20 w-[calc(100%-80px)] border-b bg-white shadow-sm lg:w-[calc(100%-280px)]"
>
  <div class="flex h-full items-center justify-between px-3">
    <h1 class="text-2xl font-semibold">
      <slot name="heading" />
    </h1>
    <slot name="right-items" />
  </div>
</div>
