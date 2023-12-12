import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface props {
  isPreview: boolean;
  setIsPreview: any;
  berkasUrl: string;
}

const DialogPreviewBerkas = (Props: props) => {
  const { isPreview, setIsPreview, berkasUrl } = Props

  return (
    <Dialog open={isPreview} onOpenChange={setIsPreview}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Preview Berkas</DialogTitle>
        </DialogHeader>
        <iframe src={berkasUrl} className="w-full h-[calc(100vh-110px)]"></iframe>
      </DialogContent>
    </Dialog>
  )

}

export default DialogPreviewBerkas