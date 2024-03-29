import FormAddSuratMasuk from '../forms/add-surat-masuk';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DialogAddSuratMasukProps {
  data?: any;
  isOpenFormAdd: boolean;
  setIsOpenFormAdd: (value: boolean) => void;
  mutate: () => void;
}

const DialogAddSuratMasuk = (props: DialogAddSuratMasukProps) => {
  const { data, isOpenFormAdd, setIsOpenFormAdd, mutate } = props;

  return (
    <Dialog open={isOpenFormAdd} onOpenChange={() => setIsOpenFormAdd(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {data && Object.keys(data).length > 0 ? 'Edit' : 'Tambah'} Surat
            Masuk
          </DialogTitle>
        </DialogHeader>
        <FormAddSuratMasuk
          data={data}
          mutate={mutate}
          setIsOpenFormAdd={setIsOpenFormAdd}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddSuratMasuk;
