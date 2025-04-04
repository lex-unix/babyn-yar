<script lang="ts">
  import { createDatePicker, melt } from '@melt-ui/svelte'
  import { jsDateToCalendarDate } from '$lib/format-date'
  import {
    ChevronLeftIcon,
    ChevronRightIcon,
    CalendarIcon
  } from 'lucide-svelte'

  export let datetime: string | undefined

  let date = datetime ? new Date(datetime) : new Date()

  const {
    elements: {
      calendar,
      cell,
      content,
      field,
      heading,
      grid,
      label,
      nextButton,
      prevButton,
      segment,
      trigger
    },
    states: { months, headingValue, weekdays, segmentContents, value },
    helpers: { isDateDisabled, isDateUnavailable },
    options: { locale }
  } = createDatePicker({
    defaultValue: jsDateToCalendarDate(date),
    locale: 'uk-UA'
  })

  $: datetime = $value?.toString()
</script>

<div>
  <span use:melt={$label} class="block text-gray-500">Дата</span>
  <div
    use:melt={$field}
    class="mt-0.5 flex max-w-[220px] min-w-[220px] items-center rounded border bg-white p-1.5 text-gray-800 hover:border-sky-400"
  >
    {#key $locale}
      {#each $segmentContents as seg}
        <span
          use:melt={$segment(seg.part)}
          class="rounded focus:ring-2 focus:ring-sky-300 focus:outline-none"
        >
          {seg.value}
        </span>
      {/each}
    {/key}
    <div>
      <button
        type="button"
        use:melt={$trigger}
        aria-label="Open calendar"
        class="rounded-md bg-indigo-50 p-1 text-indigo-700 transition-colors hover:bg-indigo-100 hover:text-indigo-800 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
      >
        <CalendarIcon size={16} />
      </button>
    </div>
  </div>
</div>

<div
  use:melt={$content}
  class="shadow-sm; z-10 min-w-[320px] rounded-lg bg-white"
>
  <div
    use:melt={$calendar}
    class="shadow-md; w-full rounded-lg border bg-white p-3 text-gray-700"
  >
    <header class="flex items-center justify-between pb-2">
      <button
        type="button"
        use:melt={$prevButton}
        class="rounded-lg p-1 transition-colors hover:bg-indigo-100 hover:text-indigo-800 data-[disabled]:pointer-events-none data-[disabled]:opacity-40"
      >
        <ChevronLeftIcon size={24} />
      </button>
      <div use:melt={$heading} class="gap-6; flex items-center font-semibold">
        {$headingValue}
      </div>
      <button
        type="button"
        use:melt={$nextButton}
        class="rounded-lg p-1 transition-colors hover:bg-indigo-100 hover:text-indigo-800 data-[disabled]:pointer-events-none data-[disabled]:opacity-40"
      >
        <ChevronRightIcon size={24} />
      </button>
    </header>
    <div>
      {#each $months as month}
        <table use:melt={$grid} class="w-full">
          <thead aria-hidden="true">
            <tr>
              {#each $weekdays as day}
                <th class="text-sm font-semibold">
                  <div
                    class="flex size-6 items-center justify-center p-4 text-gray-500 select-none"
                  >
                    {day}
                  </div>
                </th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each month.weeks as weekDates}
              <tr>
                {#each weekDates as date}
                  <td
                    role="gridcell"
                    class="p-1"
                    aria-disabled={$isDateDisabled(date) ||
                      $isDateUnavailable(date)}
                  >
                    <div
                      use:melt={$cell(date, month.value)}
                      class="cell flex size-6 cursor-pointer items-center justify-center rounded-lg p-4 select-none hover:bg-indigo-100 focus:ring focus:ring-indigo-400 focus:outline-none"
                    >
                      {date.day}
                    </div>
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      {/each}
    </div>
  </div>
</div>

<!-- TODO: get rid of postcss -->
<style lang="postcss">
  .cell[data-selected] {
    background-color: var(--color-indigo-100);
    color: var(--color-indigo-800);
  }

  .cell[data-disabled] {
    pointer-events: none;
    opacity: 40%;
  }

  .cell[data-unavailable] {
    pointer-events: none;
    color: var(--color-red-400);
    text-decoration-line: line-through;
  }

  .cell[data-outside-visible-months] {
    pointer-events: none;
    cursor: default;
    opacity: 40%;
    &:hover {
      @media (hover: hover) {
        background-color: transparent;
      }
    }
  }

  .cell[data-outside-month] {
    pointer-events: none;
    cursor: default;
    opacity: 0%;
    &:hover {
      @media (hover: hover) {
        background-color: transparent;
      }
    }
  }

  [data-melt-datefield-field] div:last-of-type {
    margin-left: var(--spacing-4);
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: flex-end;
  }

  [data-melt-datefield-label][data-invalid] {
    color: var(--color-red-500);
  }

  [data-melt-datefield-field][data-invalid] {
    border-color: var(--color-red-400);
  }

  [data-melt-datefield-segment][data-invalid] {
    color: var(--color-red-500);
  }

  [data-melt-datefield-segment]:not([data-segment='literal']) {
    padding-inline: calc(var(--spacing) * 0.5);
  }

  [data-melt-datefield-validation] {
    align-self: flex-start;
    color: var(--color-red-500);
  }
</style>
