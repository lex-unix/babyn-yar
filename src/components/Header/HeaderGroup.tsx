import * as Popover from '@radix-ui/react-popover'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import './HeaderGroup.css'

interface HeaderGroupProps {
  group: string
  children: string
}

export default function HeaderItem({ group, children }: HeaderGroupProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className="flex items-center gap-1 text-xs font-semibold uppercase text-sky-600">
        <span>{group}</span>
        <span
          className={`${
            open ? 'rotate-180' : ''
          } origin-center transition duration-150`}
        >
          <ChevronDownIcon className="h-4 w-4" />
        </span>
      </Popover.Trigger>
      <Popover.Portal className="w-full">
        <Popover.Content
          sideOffset={24}
          className="content z-10 mt-2 flex flex-col gap-4 border bg-white px-8 py-12"
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
