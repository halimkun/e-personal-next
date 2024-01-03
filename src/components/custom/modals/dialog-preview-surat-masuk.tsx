import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface DialogPreviewSuratMasukProps {
  isOpenPreview: boolean
  setIsOpenPreview: (value: boolean) => void
  selectedItem: any
}

const DialogPreviewSuratMasuk = (props: DialogPreviewSuratMasukProps) => {
  const { isOpenPreview, setIsOpenPreview, selectedItem } = props
  return (
    <Dialog open={isOpenPreview} onOpenChange={() => setIsOpenPreview(false)}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{selectedItem.perihal}</DialogTitle>
        </DialogHeader>
        <iframe src={
          `http://192.168.100.33/webapps/rsia_surat_masuk/${selectedItem.berkas}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0&navpanes=0`
        } className="w-full h-[calc(100vh-110px)]"></iframe>
      </DialogContent>
    </Dialog>
  )
}

export default DialogPreviewSuratMasuk