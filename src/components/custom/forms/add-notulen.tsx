import { useState } from 'react';

import dynamic from 'next/dynamic';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const Editor = dynamic(() => import('@/components/custom/editor'), {
  ssr: false,
});

interface FormAddNotulenProps {
  nomor: string;
  notulen?: any;
}

const FormAddNotulen = (props: FormAddNotulenProps) => {
  const { nomor, notulen } = props;

  const [pembahasan, setPembahasan] = useState(notulen?.pembahasan || '');
  const route = useRouter();

  const onSubmit = async (e: any) => {
    e.preventDefault();

    const session = await getSession();
    var data = new FormData();

    data.append('no_surat', nomor);
    data.append('pembahasan', pembahasan);

    toast.promise(
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/berkas/notulen/store`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.rsiap?.access_token}`,
        },
        body: data,
      })
        .catch((err) => {
          throw new Error(err);
        })
        .then(async (res) => {
          await new Promise((resolve) => setTimeout(resolve, 1500)); // <---- fake loading
          if (res?.ok) {
            return res?.status;
          } else {
            throw new Error('Gagal menyimpan data');
          }
        }),
      {
        loading: 'Menyimpan...',
        success: (res) => {
          route.push(`/berkas/notulen`);
          return 'Berhasil menyimpan data';
        },
        error: (err) => {
          return err?.message || 'Gagal menyimpan data';
        },
      }
    );
  };

  const onUpdate = async (e: any) => {
    e.preventDefault();

    e.preventDefault();

    const session = await getSession();
    var data = new FormData();

    data.append('no_surat', nomor);
    data.append('pembahasan', pembahasan);

    toast.promise(
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/berkas/notulen/update`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.rsiap?.access_token}`,
        },
        body: data,
      })
        .catch((err) => {
          throw new Error(err);
        })
        .then(async (res) => {
          await new Promise((resolve) => setTimeout(resolve, 1500)); // <---- fake loading
          if (res?.ok) {
            return res?.status;
          } else {
            throw new Error('Gagal menyimpan data');
          }
        }),
      {
        loading: 'Menyimpan...',
        success: (res) => {
          route.push(`/berkas/notulen`);
          return 'Berhasil menyimpan data';
        },
        error: (err) => {
          return err?.message || 'Gagal menyimpan data';
        },
      }
    );
  };

  return (
    <form method='post' onSubmit={notulen ? onUpdate : onSubmit}>
      <div className='flex flex-col gap-4'>
        <div className='space-y-1'>
          <Label htmlFor='pembahasan' className='text-primary'>
            Pembahasan
          </Label>
          <Editor
            value={pembahasan}
            onChange={(data: any) => setPembahasan(data)}
          />
        </div>

        <div className='flex items-center justify-end'>
          <Button type='submit'>Simpan</Button>
        </div>
      </div>
    </form>
  );
};

export default FormAddNotulen;
