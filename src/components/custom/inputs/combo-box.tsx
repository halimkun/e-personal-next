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

export function Combobox({ selectItems, setSelectedPj }: { selectItems: selectItemType[], setSelectedPj: any }) {
  const [val, setVal] = useState('')

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
          {val ? selectItems.find((item) => item.value === val)?.label : "Select item"}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search framework..."
            className="h-9"
          />
          <ScrollArea className="max-h-72 overflow-auto rounded-md border">
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {selectItems.map((item) => (
                <CommandItem
                  value={item.label}
                  key={item.value}
                  onSelect={() => {
                    setVal(item.value)
                    setSelectedPj(item.value)
                  }}
                >
                  {item.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4", item.value === val ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  )
}