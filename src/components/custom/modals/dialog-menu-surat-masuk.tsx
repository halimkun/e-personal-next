import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { getSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

interface DialogMenuSuratMasukProps {
  isOpenMenu: boolean
  setIsOpenMenu: (value: boolean) => void
  setIsOpenFormAdd: (value: boolean) => void
  selectedItem: any
  mutate: () => void
}

const DialogMenuSuratMasuk = (props: DialogMenuSuratMasukProps) => {
  const { isOpenMenu, setIsOpenMenu, setIsOpenFormAdd, selectedItem, mutate } = props
  const router = useRouter()

  async function handleDelete() {
    const confirm = window.confirm('Are you sure want to delete this data?')
    if (confirm) {
      const session = await getSession()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/surat/masuk/delete/${selectedItem.no}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.rsiap?.access_token}`,
        }
      })

      if (!response.ok) {
        throw new Error(response.status + ' ' + response.statusText)
      }

      const jsonData = await response.json()
      if (jsonData.success) {
        setIsOpenMenu(false)
        toast.success(jsonData.message)
      } else {
        toast.error(jsonData.message)
      }

      mutate()
    }
  }

  return (
    <Dialog open={isOpenMenu} onOpenChange={() => setIsOpenMenu(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Menu</DialogTitle>
          <DialogDescription>
            You can manipulate the data : {selectedItem.perihal}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row justify-end items-center gap-2 mt-6">
          <Button variant="default" size={'sm'} className="flex items-center gap-2" onClick={() => {
            setIsOpenFormAdd(true)
            setIsOpenMenu(false)
          }}>
            <IconEdit className="w-5 h-5" /> Edit
          </Button>
          <Button variant="destructive" size={'sm'} className="flex items-center gap-2" onClick={handleDelete}>
            <IconTrash className="w-5 h-5" /> Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogMenuSuratMasuk