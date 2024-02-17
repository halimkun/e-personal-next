import { cn } from "@/lib/utils"
import { IconSpiral } from "@tabler/icons-react"
import { IconLoader } from "@tabler/icons-react"

interface Props {
  height?: string | number
  width?: string | number
  alignItem?: string
}

// defaulr alignItem is start

const Loading1 = ({ height, width, alignItem = 'start' }: Props) => {
  if (typeof width === 'string' && !width.includes('h-')) {
    width = 'h-' + width
  }

  if (typeof height === 'string' && !height.includes('w-')) {
    height = 'w-' + height
  }

  if (typeof alignItem === 'string' && !alignItem.includes('items-')) {
    alignItem = 'items-' + alignItem
  }

  return (
    <div className={"flex flex-col " + alignItem + " justify-center h-full gap-4"}>
      <IconSpiral className={cn(
        'animate-spin',
        height ? height : 'h-10',
        width ? width : 'w-10'
      )} />
    </div>
  )
}

export default Loading1