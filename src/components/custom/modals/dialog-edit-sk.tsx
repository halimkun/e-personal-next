import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import FormAddSK from "../forms/add-sk";

interface DialogEditSkProps {
  isFormEditOpen: boolean;
  setIsFormEditOpen: (value: boolean) => void;
  selectedData: any;
  date: Date | null;
  setDate: (value: Date | null) => void;
  jenis: string | undefined;
  setJenis: (value: string | undefined) => void;
  mutate: () => void;
}

const DialogEditSk = (props: DialogEditSkProps) => {
  const {
    isFormEditOpen,
    setIsFormEditOpen,
    selectedData,
    date,
    setDate,
    jenis,
    setJenis,
    mutate,
  } = props

  return (
    <Dialog open={isFormEditOpen} onOpenChange={setIsFormEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Surat Keputusan Direktur</DialogTitle>
          <DialogDescription>
            {selectedData ? (
              <Badge variant={selectedData.status === '1' ? 'default' : 'destructive'} className="mr-2">
                {`${selectedData.nomor.toString().padStart(3, '0')}/${selectedData.jenis}/${selectedData.prefix}/${new Date(selectedData.tgl_terbit).toLocaleDateString('id-ID', {
                  year: '2-digit',
                  month: '2-digit',
                  day: '2-digit'
                }).split('/').join('')}`}
              </Badge>
            ) : <></>}
            You can edit this data. but be careful editing number can cause duplicate data in the database and possibly cause errors.
          </DialogDescription>
        </DialogHeader>
        <FormAddSK
          data={selectedData}
          date={date}
          setDate={setDate}
          jenis={jenis}
          setJenis={setJenis}
          setIsOpenFormAdd={setIsFormEditOpen}
          mutate={mutate}
        />
      </DialogContent>
    </Dialog>
  )
}

export default DialogEditSk;