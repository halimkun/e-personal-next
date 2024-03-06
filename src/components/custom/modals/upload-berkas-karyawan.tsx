import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IconCirclePlus } from '@tabler/icons-react';

import FormUploadBerkasPegawai from '../forms/upload-berkas-pegawai';
import { useState } from 'react';

const UploadBerkasKaryawan = ({ nik }: any) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='h-8 px-2 text-foreground'>
          <IconCirclePlus className='mr-1' /> Tambah
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md lg:max-w-xl'>
        <DialogHeader>
          <DialogTitle>Preview Berkas</DialogTitle>
          <DialogDescription>
            Unggah berkas pegawai sebagai bukti bahwa pegawai tersebut telah
            bekerja di RSIA Aisyiyah Pekajangan
          </DialogDescription>
        </DialogHeader>

        <div className='mt-4'>
          <FormUploadBerkasPegawai nik={nik} setOpen={setOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadBerkasKaryawan;
