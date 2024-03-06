import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import FormEditPks from '@/components/custom/forms/edit-pks';
import { IconExclamationCircle } from '@tabler/icons-react';

interface props {
  isModalEditOpen: boolean;
  setIsModalEditOpen: any;
  pks: any;
}

const DialogEditPks = (Props: props) => {
  const { isModalEditOpen, setIsModalEditOpen, pks } = Props;

  return (
    <Dialog open={isModalEditOpen} onOpenChange={setIsModalEditOpen}>
      <DialogContent className='max-w-xl'>
        <DialogHeader>
          <DialogTitle>Forms Edit PKS</DialogTitle>
          <DialogDescription>
            Anda bisa mengedit data perjanjian kerjasama ini melalui form
            dibawah ini.
            {/* alert */}
            <div className='mt-1.5 rounded-xl border-2 border-warning px-3 py-2'>
              <div className='flex items-center justify-start gap-2 font-bold text-warning'>
                <IconExclamationCircle className='h-4 w-4 text-warning' />{' '}
                Perhatian!
              </div>
              Harap berhati-hati dalam mengedit{' '}
              <span className='font-bold'>Nomor Surat</span> agar tidak terjadi
              duplikasi data.
            </div>
          </DialogDescription>
        </DialogHeader>
        <FormEditPks pks={pks} />
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditPks;
