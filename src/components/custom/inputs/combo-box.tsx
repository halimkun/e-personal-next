"use client"

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"


interface selectItemType {
  value: string;
  label: string;
}

export function Combobox({ items, setSelectedItem, selectedItem }: { items: selectItemType[], setSelectedItem: any, selectedItem?: string }) {
  const [val, setVal] = useState(selectedItem ?? "")

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between",
            !val && "text-muted-foreground"
          )}
        >
          {val ? items.find((item) => item.value === val)?.label : "Select item"}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-full">
          <CommandInput
            placeholder="Search framework..."
            className="h-9"
          />
          <ScrollArea className="max-h-72 w-full overflow-auto rounded-md border">
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {/* if items empty dont map */}
              {items.length > 0 ? items.map((item) => (
                <CommandItem
                  value={item.label}
                  key={item.value}
                  onSelect={() => {
                    setVal(item.value)
                    setSelectedItem(item.value)
                  }}
                >
                  {item.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4", item.value === val ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              )) : <CommandEmpty>No framework found.</CommandEmpty>}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  )
}