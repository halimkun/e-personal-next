import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  IconDownload,
  IconEdit,
  IconFileSearch,
  IconTrash,
} from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getFullDate } from '@/lib/date';
import SeparatorWithText from '../separator-with-text';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';

import PDFFile from '@/templates/pdf/spo';

interface DialogMenuSpoProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  spo: any;
  onDelete: () => void;
  spoDetail: any;
  setIsFormEditOpen: (value: boolean) => void;
  setIsViewSpoOpen: (value: boolean) => void;
}

const DialogMenuSpo = (props: DialogMenuSpoProps) => {
  const router = useRouter();
  const {
    isMenuOpen,
    setIsMenuOpen,
    spo,
    onDelete,
    spoDetail,
    setIsFormEditOpen,
    setIsViewSpoOpen,
  } = props;

  return (
    <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Menu Standar Prosedur Operasional</DialogTitle>
          <DialogDescription>
            <Badge variant={'outline'} className='mr-2'>
              {spo.nomor}
            </Badge>
            Anda dapat memilih menu dibawah ini untuk melakukan aksi pada SPO
            terpilih.
          </DialogDescription>
        </DialogHeader>

        <div className='mb-4 space-y-2 text-left'>
          <table className='table w-full'>
            <tbody>
              <tr>
                <th>Nomor</th>
                <th className='px-2'>:</th>
                <td>{spo.nomor}</td>
              </tr>
              <tr>
                <th>Judul</th>
                <th className='px-2'>:</th>
                <td>{spo.judul}</td>
              </tr>
              <tr>
                <th>Unit</th>
                <th className='px-2'>:</th>
                <td>
                  {/* flex can be entered */}
                  <div className='flex flex-wrap gap-1'>
                    {spo.unit
                      ? spo.unit
                          .split(',')
                          .map((unit: string, index: number) => (
                            <Badge variant='outline' key={index}>
                              {unit}
                            </Badge>
                          ))
                      : '-'}
                  </div>
                </td>
              </tr>
              <tr>
                <th className='whitespace-nowrap'>Tanggal Terbit</th>
                <th className='px-2'>:</th>
                <td>{getFullDate(spo.tgl_terbit)}</td>
              </tr>
              <tr>
                <th>Jenis</th>
                <th className='px-2'>:</th>
                <td>{spo.jenis}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className='flex w-full justify-between'>
          <div className='flex w-full justify-end gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='flex items-center gap-2'
              onClick={() => {
                setIsMenuOpen(false);
                setIsFormEditOpen(true);
              }}
            >
              <IconEdit className='h-4 w-4' /> Edit
            </Button>
            <Button
              variant='destructive'
              size='sm'
              className='flex items-center gap-2'
              onClick={() =>
                window.confirm('Apakah anda yakin ingin menghapus data ini?') &&
                onDelete()
              }
            >
              <IconTrash className='h-4 w-4' /> Hapus
            </Button>
          </div>
        </div>

        <SeparatorWithText text='spo detail' />
        <div className='flex flex-wrap gap-3'>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
            onClick={() =>
              router.push(`/berkas/spo/${spo.nomor.replace(/\//g, '--')}`)
            }
          >
            <IconEdit className='h-4 w-4' /> Edit SPO
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
            onClick={() => {
              setIsMenuOpen(false);
              setIsViewSpoOpen(true);
            }}
          >
            <IconFileSearch className='h-4 w-4' /> Lihat SPO
          </Button>
          {spoDetail && (
            // `${process.env.NEXT_PUBLIC_API_URL}/berkas/spo/render/{nomorspo}
            // download link to that url
            <Button
              variant='outline'
              size='sm'
              className='flex items-center gap-2'
              onClick={() =>
                window.open(
                  `${process.env.NEXT_PUBLIC_API_URL}/berkas/spo/render/${spo.nomor.replace(/\//g, '--')}`
                )
              }
            >
              <IconDownload className='h-4 w-4' /> Download SPO
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogMenuSpo;
