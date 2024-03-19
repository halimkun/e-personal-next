import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { DatePicker } from '../inputs/date-picker';
import { Combobox } from '../inputs/combo-box';
import { IconLoader } from '@tabler/icons-react';
import { getSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

import useSWR from 'swr';

interface formAddPpiProps {
  onSubmitted: any;
  penanggungJawab?: any;
  setPenanggungJawab?: any;
  tglTerbit?: any;
  setTglTerbit?: any;
}

const FormAddPPI = (props: formAddPpiProps) => {
  const {
    onSubmitted,
    penanggungJawab,
    setPenanggungJawab,
    tglTerbit,
    setTglTerbit,
  } = props;
  const [pj, setPj] = useState<any>(null);

  const fetcher = async (url: string) => {
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

  const {
    data: dataPj,
    error,
    isLoading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/pegawai?datatables=1&with=bidang_detail&select=nik,nama`,
    fetcher
  );

  return (
    <form action='' method='post' onSubmit={onSubmitted}>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col items-center justify-center gap-4 lg:flex-row'>
          <div className='w-full space-y-1'>
            <Label className='font-semibold text-primary' htmlFor='tgl_terbit'>
              Tanggal Terbit
            </Label>
            <DatePicker
              date={tglTerbit}
              setDate={setTglTerbit}
              placeholder='pilih tanggal'
            />
          </div>
          {pj ? (
            <div className='w-full space-y-1'>
              <Label className='font-semibold text-primary'>
                Penanggung Jawab
              </Label>
              <Combobox
                items={pj}
                setSelectedItem={setPenanggungJawab}
                selectedItem={penanggungJawab}
                placeholder='Penanggung Jawab'
              />
            </div>
          ) : (
            <div className='flex w-full items-center space-x-2'>
              <IconLoader className='h-5 w-5 animate-spin' />
              <span>Loading Penanggung Jawab...</span>
            </div>
          )}
        </div>

        <div className='w-full space-y-1'>
          <Label htmlFor='perihal' className='font-semibold text-primary'>
            Perihal
          </Label>
          <Textarea name='perihal' id='perihal' placeholder='perihal berkas' />
        </div>
      </div>

      <div className='mt-8 flex justify-end'>
        <Button type='submit' variant='default'>
          Simpan
        </Button>
      </div>
    </form>
  );
};

export default FormAddPPI;
