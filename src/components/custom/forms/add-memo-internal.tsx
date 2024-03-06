import { useState } from 'react';

import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Combobox } from '../inputs/combo-box';
import { IconLoader } from '@tabler/icons-react';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePickerDemo } from '../inputs/date-picker';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import useSWR from 'swr';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

const TablePegawai = dynamic(
  () => import('@/components/custom/tables/pegawai'),
  { ssr: false }
);
const TablePegawaiMengetahui = dynamic(
  () => import('@/components/custom/tables/pegawai-mengetahui'),
  { ssr: false }
);
const Editor = dynamic(() => import('@/components/custom/editor'), {
  ssr: false,
});

interface FormAddMemoInternalProps {
  data?: any;
}

const FormAddMemoInternal = (props: FormAddMemoInternalProps) => {
  const route = useRouter();

  const [pj, setPj] = useState<any>(null);
  const [selectedPJ, setSelectedPJ] = useState<any>(
    props.data?.perihal?.pj ?? ''
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isiKonten, setIsiKonten] = useState(props.data?.content ?? '');
  const [tglTerbit, setTglTerbit] = useState<Date | null>(
    props.data?.perihal?.tgl_terbit
      ? new Date(props.data.perihal?.tgl_terbit)
      : new Date()
  );

  const maxMengetahui = 2;
  const [selectedMengetahui, setSelectedMengetahui] = useState<string[]>(
    props.data?.mengetahui ? props.data.mengetahui.split('|') : []
  );
  const [selectedKaryawan, setSelectedKaryawan] = useState<string[]>(
    props.data?.penerima
      ? props.data.penerima.map((item: any) => item.penerima)
      : []
  );

  const KaryawanColumns = [
    {
      name: '',
      selector: 'pilih',
      data: (row: any) => (
        <div className='px-2'>
          <Checkbox
            id={row.nik}
            name='karyawan[]'
            value={row.nik}
            checked={selectedKaryawan.includes(row.nik)}
            onCheckedChange={() => {
              if (selectedKaryawan.includes(row.nik)) {
                setSelectedKaryawan(
                  selectedKaryawan.filter((item) => item !== row.nik)
                );
              } else {
                setSelectedKaryawan([...selectedKaryawan, row.nik]);
              }
            }}
          />
        </div>
      ),
    },

    {
      name: 'Nama',
      selector: 'nama',
      data: (row: any) => (
        <div className='flex items-center gap-4'>
          <label
            htmlFor={row.nik}
            className='w-full text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            <div className='font-bold'>{row.nama}</div>
          </label>
        </div>
      ),
    },

    {
      name: 'NIK',
      selector: 'nik',
      data: (row: any) => (
        <div className='flex items-center gap-4'>
          <label
            htmlFor={row.nik}
            className='w-full text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            <Badge variant='secondary' className='cursor-pointer'>
              {row.nik}
            </Badge>
          </label>
        </div>
      ),
    },

    {
      name: 'Jabatan',
      selector: 'jabatan',
      data: (row: any) => (
        <div className='flex items-center gap-4'>
          <label
            htmlFor={row.nik}
            className='w-full text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            {row.jbtn}
          </label>
        </div>
      ),
    },

    {
      name: 'Bidang',
      selector: 'bidang',
      data: (row: any) => (
        <div className='flex items-center gap-4'>
          <label
            htmlFor={row.nik}
            className='w-full text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            {row.bidang}
          </label>
        </div>
      ),
    },

    {
      name: 'Departemen',
      selector: 'departemen',
      data: (row: any) => (
        <div className='flex items-center gap-4'>
          <label
            htmlFor={row.nik}
            className='w-full text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            {row.dpt.nama}
          </label>
        </div>
      ),
    },
  ];

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    const session = await getSession();
    const data = new FormData(e.target);

    // add tglTerbit to data
    data.append('tanggal', tglTerbit?.toISOString().slice(0, 10) ?? '');
    data.append('content', isiKonten);
    data.append('penerima', JSON.stringify(selectedKaryawan));

    data.append('pj', selectedPJ);

    // joined mengetahui
    const jm = selectedMengetahui.join('|');
    data.append('mengetahui', jm);

    if (props.data?.no_surat) {
      data.append('no_surat', props.data.no_surat);
    }

    // if props.data available, then it's an edit form
    if (props.data) {
      var url = '/berkas/memo/internal/update';
    } else {
      var url = '/berkas/memo/internal/store';
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + session?.rsiap?.access_token,
      },
      body: data,
    }).then((response) => response.json());

    if (response.success) {
      setIsSubmitting(false);
      toast.success(response.message);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      route.push('/memo/internal');
    } else {
      setIsSubmitting(false);
      toast.error(response.message);
    }
  };

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
    <div className='w-full'>
      <form method='post' className='flex flex-col gap-3' onSubmit={onSubmit}>
        <div className='flex flex-col items-start gap-3 md:flex-row'>
          <Card className='top-16 w-full lg:sticky'>
            <CardHeader>
              <CardTitle>Buat Memo Internal Baru</CardTitle>
              <CardDescription>
                Isi form dibawah ini untuk membuat memo internal baru
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col gap-3'>
                <div className='flex flex-col gap-2 lg:flex-row'>
                  <div className='w-full space-y-1'>
                    <Label className='font-semibold text-primary'>Dari</Label>
                    <Input
                      placeholder='pengirim memo'
                      name='dari'
                      defaultValue={props.data?.dari ?? ''}
                    />
                  </div>

                  <div className='w-[70%] space-y-1'>
                    <Label
                      className='font-semibold text-primary'
                      htmlFor='tgl_terbit'
                    >
                      Tanggal Terbit
                    </Label>
                    <DatePickerDemo
                      date={tglTerbit}
                      setDate={setTglTerbit}
                      placeholder='pilih tanggal'
                    />
                  </div>
                </div>

                {pj ? (
                  <div className='space-y-1'>
                    <Label className='font-semibold text-primary'>
                      Penanggung Jawab
                    </Label>
                    <Combobox
                      items={pj}
                      setSelectedItem={setSelectedPJ}
                      selectedItem={props.data?.pj ?? selectedPJ}
                      placeholder='Penanggung Jawab'
                    />
                  </div>
                ) : (
                  <div className='flex items-center space-x-2'>
                    <IconLoader className='h-5 w-5 animate-spin' />
                    <span>Loading Penanggung Jawab...</span>
                  </div>
                )}

                <div className='space-y-1'>
                  <Label className='font-semibold text-primary'>Perihal</Label>
                  <Input
                    placeholder='perihal memo internal'
                    name='perihal'
                    defaultValue={props.data?.perihal?.perihal ?? ''}
                  />
                </div>

                <div className='space-y-1'>
                  <Label className='font-semibold text-primary'>
                    Isi Konten
                  </Label>
                  <Editor
                    value={isiKonten}
                    onChange={(data: any) => setIsiKonten(data)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <TablePegawaiMengetahui
            selectedMengetahui={selectedMengetahui}
            setSelectedMengetahui={setSelectedMengetahui}
            maxMengetahui={maxMengetahui}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Penerima Memo</CardTitle>
            <CardDescription>Pilih penerima memo internal</CardDescription>
          </CardHeader>
          <CardContent>
            <TablePegawai columnsData={KaryawanColumns} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='p-3'>
            <div className='flex items-center justify-between'>
              <div className='font-bold'>
                <span className='text-primary'>Penerima</span> ({' '}
                {selectedKaryawan.length} orang )
              </div>
              <Button
                type='submit'
                className='hover:bg-primary-600 bg-primary text-white'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Memo'}
              </Button>
            </div>
          </CardHeader>
        </Card>
      </form>
    </div>
  );
};

export default FormAddMemoInternal;
