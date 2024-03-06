import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import FormAddSK from '../forms/add-sk';

interface DialogAddSkProps {
  isOpenFormAdd: boolean;
  setIsOpenFormAdd: (value: boolean) => void;
  date: Date | null;
  setDate: (value: Date | null) => void;
  jenis: string | undefined;
  setJenis: (value: string | undefined) => void;
  mutate: () => void;
}

const DialogAddSk = (props: DialogAddSkProps) => {
  const {
    isOpenFormAdd,
    setIsOpenFormAdd,
    date,
    setDate,
    jenis,
    setJenis,
    mutate,
  } = props;

  return (
    <Dialog open={isOpenFormAdd} onOpenChange={setIsOpenFormAdd}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Surat Keputusan Direktur</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <FormAddSK
          date={date}
          setDate={setDate}
          jenis={jenis}
          setJenis={setJenis}
          setIsOpenFormAdd={setIsOpenFormAdd}
          mutate={mutate}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddSk;
