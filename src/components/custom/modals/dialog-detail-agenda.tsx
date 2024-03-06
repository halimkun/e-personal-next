import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { Combobox } from '../inputs/combo-box';
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';

interface DialogDetailAgendaProps {
  evt: any;
  setEvt: any;
  detail: boolean;
  setDetail: any;
  setEdit: any;
}

const renameStatus = (status: string) => {
  switch (status) {
    case 'pengajuan':
      return 'Belum Selesai';
    case 'disetujui':
      return 'Selesai';
    case 'ditolak':
      return 'Batal';
    default:
      return status;
  }
};

const DialogDetailAgenda = (props: DialogDetailAgendaProps) => {
  const { evt, setEvt, detail, setDetail, setEdit } = props;
  const router = useRouter();
  const [selectedSTatus, setSelectedStatus] = useState<any>(
    evt.resource?.status
  );

  useEffect(() => {
    const updateStatus = async (status: string) => {
      const session = await getSession();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/agenda/${evt.resource?.id}/status`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.rsiap?.access_token}`,
          },
          body: JSON.stringify({
            status: status,
          }),
        }
      );

      const data = await res.json();
      return data;
    };

    if (selectedSTatus) {
      updateStatus(selectedSTatus).then(async (res) => {
        if (res.success) {
          setDetail(false);
          toast.success('Status berhasil diubah');
          await new Promise((resolve) => setTimeout(resolve, 1000));
          router.reload();
        } else {
          toast.error('Status gagal diubah');
        }
      });
    }
  }, [selectedSTatus, evt.resource?.id]);

  // delete function
  async function deleteAgenda() {
    const session = await getSession();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/agenda/${evt.resource?.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.rsiap?.access_token}`,
        },
      }
    );

    const data = await res.json();
    return data;
  }

  const statusSelect = [
    {
      label: 'Belum Selesai',
      value: 'pengajuan',
    },
    {
      label: 'Selesai',
      value: 'disetujui',
    },
    {
      label: 'Batal',
      value: 'ditolak',
    },
  ];

  return (
    <Dialog open={detail} onOpenChange={setDetail}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='leading-6 text-primary'>
            {evt.title}
          </DialogTitle>
          <DialogHeader>
            <span className='text-sm text-gray-600 dark:text-gray-500'>
              {evt.resource?.no_surat}
            </span>
          </DialogHeader>
        </DialogHeader>

        <table className='mb-5 table w-full text-left'>
          <tr>
            <th>Penanggung Jawab</th>
            <th>
              <span className='px-2'>:</span>
            </th>
            <td>
              {evt.resource?.pj_detail
                ? evt.resource?.pj_detail.nama
                : evt.resource?.pj}
            </td>
          </tr>
          <tr>
            <th>Tempat</th>
            <th>
              <span className='px-2'>:</span>
            </th>
            <td>{evt.resource?.tempat}</td>
          </tr>
          <tr>
            <th>Tanggal</th>
            <th>
              <span className='px-2'>:</span>
            </th>
            <td>
              {new Date(evt.resource?.tanggal).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}{' '}
              -{' '}
              {new Date(evt.resource?.tanggal).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </td>
          </tr>
          <tr>
            <th>Status</th>
            <th>
              <span className='px-2'>:</span>
            </th>
            <td>{renameStatus(evt.resource?.status)}</td>
          </tr>

          {evt.resource?.keterangan && (
            <tr>
              <th>Keterangan</th>
              <th>
                <span className='px-2'>:</span>
              </th>
              <td>{evt.resource?.keterangan}</td>
            </tr>
          )}
        </table>

        {!evt.resource?.hasSurat && (
          // button edit and delete
          <div className='flex gap-4'>
            <Button
              className='w-full'
              variant='default'
              onClick={() => {
                setEdit(true);
                setDetail(false);
              }}
            >
              Edit
            </Button>
            <Button
              className='w-full'
              variant='destructive'
              onClick={() => {
                const c = window.confirm(
                  'Apakah anda yakin ingin menghapus agenda ini?'
                );
                if (c) {
                  deleteAgenda().then(async (res) => {
                    if (res.success) {
                      setDetail(false);
                      toast.success('Agenda berhasil dihapus');
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      router.reload();
                    } else {
                      toast.error('Agenda gagal dihapus');
                    }
                  });
                }
              }}
            >
              Hapus
            </Button>

            <Combobox
              setSelectedItem={setSelectedStatus}
              selectedItem={selectedSTatus}
              placeholder='Status Agenda'
              items={statusSelect}
            />

            {/* <Button
              className="w-full"
              variant="secondary"
              onClick={() => {
                toast.error('Fitur ini belum tersedia')
              }}
            >
              status
            </Button> */}
          </div>
        )}
        {evt.resource?.hasSurat ? (
          <Button
            onClick={() => {
              const url = `surat/internal/${evt.resource?.no_surat.replace(/\//g, '_')}/detail`;
              window.open(url, '_blank');
            }}
          >
            Lihat Surat
          </Button>
        ) : (
          <Button disabled>Lihat Surat</Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogDetailAgenda;
