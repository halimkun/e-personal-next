import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button, buttonVariants } from "@/components/ui/button";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { getSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getFullDateWithDayName } from "@/lib/date";

interface DialogMenuSuratMasukProps {
  isOpenMenu: boolean
  setIsOpenMenu: (value: boolean) => void
  setIsOpenFormAdd?: (value: boolean) => void
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
          <DialogTitle>Menu | {selectedItem.perihal}</DialogTitle>
          <DialogDescription>
            Anda dapat melakukan manipulasi data terhadap surat masuk ini dengan beberapa menu yang tersedia di bawah ini.
          </DialogDescription>
        </DialogHeader>

        <table className="table w-full text-left">
          <tr className="align-top">
            <th className="whitespace-nowrap">No. SIMRS</th>
            <td><span className="px-2">:</span></td>
            <td>{new Date(selectedItem.no_simrs).toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
          </tr>
          <tr className="align-top">
            <th>Perihal</th>
            <td><span className="px-2">:</span></td>
            <td>{selectedItem.perihal}</td>
          </tr>
          <tr className="align-top">
            <th>Pengirim</th>
            <td><span className="px-2">:</span></td>
            <td>{selectedItem.pengirim}</td>
          </tr>
          <tr className="align-top">
            <th>Tgl Surat</th>
            <td><span className="px-2">:</span></td>
            <td>{getFullDateWithDayName(selectedItem.tgl_surat)}</td>
          </tr>
        </table>

        <div className="flex flex-row justify-end items-center gap-2 mt-6">
          <Link href={`/surat/masuk/${selectedItem.no}/edit`} className={cn(buttonVariants({
            variant: 'default',
            size: 'sm'
          }), 'flex items-center gap-2')} onClick={() => setIsOpenMenu(false)} replace={true} scroll={false} shallow={true} passHref={true} >
            <IconEdit className="w-5 h-5" /> Edit
          </Link>

          <Button variant="destructive" size={'sm'} className="flex items-center gap-2" onClick={handleDelete}>
            <IconTrash className="w-5 h-5" /> Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogMenuSuratMasuk