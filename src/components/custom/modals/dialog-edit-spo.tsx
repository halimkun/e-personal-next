import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { IconExclamationCircle } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import FormEditSpo from "@/components/custom/forms/edit-spo"

type DialogEditSpoProps = {
  isFormEditOpen: boolean
  setIsFormEditOpen: (value: boolean) => void
  spo: any
}

const DialogEditSpo = (props: DialogEditSpoProps) => {
  const { isFormEditOpen, setIsFormEditOpen, spo } = props

  return (
    <Dialog open={isFormEditOpen} onOpenChange={setIsFormEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit SPO <Badge variant={'outline'}>{spo.nomor}</Badge></DialogTitle>
          <DialogDescription>
            Anda bisa mengedit data perjanjian kerjasama ini melalui form dibawah ini.
            <div className="px-3 py-2 rounded-xl border-2 border-warning mt-1.5">
              <div className="font-bold flex items-center justify-start text-warning gap-2">
                <IconExclamationCircle className="h-4 w-4 text-warning" /> Perhatian!
              </div>
              Harap berhati-hati dalam mengedit <span className="font-bold">Nomor SPO</span> agar tidak terjadi duplikasi data.
            </div>
          </DialogDescription>
        </DialogHeader>

        <FormEditSpo data={spo} />
      </DialogContent>
    </Dialog>
  )
}

export default DialogEditSpo