import { cn } from "@/lib/utils"
import { IconLoader } from "@tabler/icons-react"

interface Props {
  height?: string | number
  width?: string | number
}

// if width is string check if the width contain h- or not, if not concat h- to the width

const Loading1 = ({ height, width }: Props) => {
  if (typeof width === 'string' && !width.includes('h-')) {
    width = 'h-' + width
  }

  if (typeof height === 'string' && !height.includes('w-')) {
    height = 'w-' + height
  }

  return (
    <div className="flex flex-col items-start justify-center h-full gap-4">
      <IconLoader className={cn(
        'animate-spin',
        height ? height : 'h-10',
        width ? width : 'w-10'
      )} />
    </div>
  )
}

export default Loading1