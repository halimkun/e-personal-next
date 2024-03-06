import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Combobox } from '../inputs/combo-box';
import { DatePickerDemo } from '../inputs/date-picker';
import { IconDeviceSdCard, IconLoader } from '@tabler/icons-react';
import { getSession } from 'next-auth/react';

import toast from 'react-hot-toast';
import React from 'react';
import useSWR from 'swr';

interface formAddSKProps {
  data?: any;
  date: Date | null;
  setDate: any;
  jenis: string | undefined;
  setJenis: any;
  setIsOpenFormAdd: any;
  mutate: any;
}

const FormAddSK = ({
  data,
  date,
  setDate,
  jenis,
  setJenis,
  mutate,
  setIsOpenFormAdd,
}: formAddSKProps) => {
  const [d, setD] = React.useState<any>(null);
  const [j, setJ] = React.useState<any>(null);
  const [pj, setPj] = React.useState<any>(null);
  const [selectedPJ, setSelectedPJ] = React.useState<any>('');

  React.useEffect(() => {
    if (data) {
      setD(new Date(data.tgl_terbit));
      setJ(data.jenis);

      setJenis(data.jenis);
      setDate(new Date(data.tgl_terbit));
    }
  }, [data]);

  const fetchPegawai = async (url: string) => {
    const session = await getSession();
    return await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.rsiap?.access_token}`,
      },
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.status + ' ' + response.statusText);
      }

      const data = response.json();
      const result = data.then((res) => {
        const data = res.data.map((item: any) => {
          return {
            value: item.nik,
            label: item.nama,
          };
        });

        setPj(data);
      });

      return data;
    });
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const session = await getSession();
    const data = new FormData(e.target);

    if (jenis) {
      data.set('jenis', jenis);
    }

    // post data to api
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/berkas/sk/store`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.rsiap?.access_token}`,
        },
        body: data,
      }
    );

    const result = await res.json();
    if (result.success) {
      toast.success('Data berhasil disimpan!');

      // reload table swr
      mutate();

      // reset form and close modal
      e.target.reset();
      setIsOpenFormAdd(false);
    } else {
      if (typeof result.message === 'string') {
        toast.error(result.message);
        return;
      }

      for (const [key, value] of Object.entries(result.message)) {
        const val = value as string[];
        toast.error(val[0]);
      }
    }
  };

  const onUpdate = async (e: any) => {
    e.preventDefault();
    const session = await getSession();
    const data = new FormData(e.target);

    if (jenis) {
      data.set('jenis', jenis);
    }

    // post data to api
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/berkas/sk/update`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.rsiap?.access_token}`,
        },
        body: data,
      }
    );

    const result = await res.json();
    if (result.success) {
      toast.success('Data berhasil disimpan!');

      // reload table swr
      mutate();

      // reset form and close modal
      e.target.reset();
      setIsOpenFormAdd(false);
    } else {
      if (typeof result.message === 'string') {
        toast.error(result.message);
        return;
      }

      for (const [key, value] of Object.entries(result.message)) {
        const val = value as string[];
        toast.error(val[0]);
      }
    }
  };

  const {
    data: dataPj,
    error,
    isLoading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/pegawai?datatables=1&with=bidang_detail&select=nik,nama`,
    fetchPegawai
  );

  return (
    <form
      method='post'
      id='form-add-sk'
      onSubmit={data ? onUpdate : onSubmit}
      encType='multipart/form-data'
    >
      {data ? (
        <>
          <Input type='hidden' name='old_nomor' value={data.nomor} />
          <Input type='hidden' name='old_jenis' value={data.jenis} />
          <Input type='hidden' name='old_tgl_terbit' value={data.tgl_terbit} />
        </>
      ) : (
        <></>
      )}
      <div className='space-y-3'>
        {data && (
          <div className='space-y-1.5'>
            <Label htmlFor='nomor'>Nomor Dokumen</Label>
            <Input
              id='nomor'
              name='nomor'
              placeholder={
                data
                  ? 'nomor dokumen sebelumnya : ' + data.nomor
                  : 'nomor dokumen'
              }
              defaultValue={data ? data.nomor : ''}
              className='w-full'
            />
          </div>
        )}
        <div className='space-y-1.5'>
          <Label htmlFor='judul'>Judul SK</Label>
          <Input
            id='judul'
            name='judul'
            placeholder='judul sk yang akan dibuat'
            defaultValue={data ? data.judul : ''}
            className='w-full'
          />
        </div>
        <div className='flex flex-col gap-3'>
          <div className='w-full space-y-1.5'>
            <Label htmlFor='pj'>Penanggung Jawab</Label>
            <Input
              type='hidden'
              id='pj'
              name='pj'
              placeholder='pilih pj'
              className='w-full'
              defaultValue={data ? data.pj : selectedPJ}
            />
            {pj ? (
              <Combobox
                items={pj}
                setSelectedItem={setSelectedPJ}
                selectedItem={data ? data.pj : selectedPJ}
                placeholder='Penanggung Jawab'
              />
            ) : (
              <div className='flex items-center space-x-2'>
                <IconLoader className='h-5 w-5 animate-spin' />
                <span>Loading Penanggung Jawab...</span>
              </div>
            )}
          </div>
          <div className='w-full space-y-1.5'>
            <Label htmlFor='tgl_terbit'>Tanggal Terbit</Label>
            <Input
              type='hidden'
              id='tgl_terbit'
              name='tgl_terbit'
              placeholder='pilih tanggal terbit'
              value={new Date(date || Date.now())
                .toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                })
                .split('/')
                .reverse()
                .join('-')}
            />
            <DatePickerDemo
              date={data ? d : date}
              setDate={setDate}
              placeholder='pilih tanggal terbit'
            />
          </div>
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='jenis'>Jenis SK</Label>
          <Combobox
            items={[
              { value: 'A', label: 'SK Dokumen' },
              { value: 'B', label: 'SK Pengangkatan Jabatan' },
            ]}
            setSelectedItem={(item: any) => setJenis(item)}
            selectedItem={data ? j : jenis}
            placeholder='Jenis SK'
          />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='berkas'>Berkas SK</Label>
          <Input
            type='file'
            id='berkas'
            name='berkas'
            placeholder='pilih berkas'
            className='w-full'
          />
        </div>
      </div>

      <div className='mt-5 flex justify-end gap-3'>
        <Button
          size={'sm'}
          type='submit'
          className='font-bold text-primary-foreground'
        >
          <IconDeviceSdCard className='mr-2 h-4 w-4' />
          Save
        </Button>
      </div>
    </form>
  );
};

export default FormAddSK;
