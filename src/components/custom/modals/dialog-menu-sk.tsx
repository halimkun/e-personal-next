import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { IconEdit, IconTrash } from "@tabler/icons-react"

type Props = {
  isOpenMenu: boolean
  setIsOpenMenu: (value: boolean) => void
  setIsFormEditOpen: (value: boolean) => void
}

const DialogMenuSk = (props: Props) => {
  const { isOpenMenu, setIsOpenMenu, setIsFormEditOpen } = props
  return (
    <Dialog open={isOpenMenu} onOpenChange={setIsOpenMenu}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Menu SK Direktur</DialogTitle>
          <DialogDescription>
            You can manipulate this data, using the menu below. but be careful to do it, cause it can cause errors like duplicate data in the database.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex items-center justify-end">
          <Button variant={'default'} size={'sm'} onClick={() => {
            setIsFormEditOpen(true)
            setIsOpenMenu(false)
          }} >
            <IconEdit className="w-5 h-5 mr-2" /> <span className="font-bold">Edit SK</span>
          </Button>
          <Button variant={'destructive'} size={'sm'} className="ml-2" onClick={() => {
            setIsOpenMenu(false)
          }}>
            <IconTrash className="w-5 h-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogMenuSk