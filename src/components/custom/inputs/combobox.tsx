"use client"

import * as React from "react"
import { IconCheck, IconCaretUpDown } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function Combobox1({ items, setSelectedItem, selectedItem, placeholder }: any) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full min-w-[200px] justify-between"
        >
          {selectedItem
            ? items.find((item: any) => item.value === selectedItem)?.label
            : placeholder}
          <IconCaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {items.map((item: any) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={(currentValue) => {
                  setSelectedItem(currentValue === selectedItem ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <IconCheck
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedItem === item.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
