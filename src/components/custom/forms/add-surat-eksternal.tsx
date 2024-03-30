import LaravelPagination from '../../custom-ui/laravel-pagination';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/router';
import { Combobox } from '../inputs/combo-box';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

export default function FormAddSuratEksternal(penanggungJawab: any) {
  const router = useRouter();
  const { data } = useSession();

  const [selectedPj, setSelectedPj] = useState('');
  // tgl terbit default to current date with format dd/mm/yyyy
  const [tglTerbit, setTglTerbit] = useState(new Date().toISOString().split('T')[0]);
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('.')[0]);
  const [lastNomorSurat, setLastNomorSurat] = useState('');
  const [newNomorSurat, setNewNomorSurat] = useState('');
  const [selectedKaryawan, setSelectedKaryawan] = useState<string[]>([]);

  const fetchLastNomor = async () => {
    const rs = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/surat/eksternal/last-nomor?tgl_terbit=${tglTerbit}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${data?.rsiap?.access_token}`,
        },
      }
    );

    const result = await rs.json();
    if (result.success) {
      setLastNomorSurat(result.data?.no_surat);
    } else {
      setLastNomorSurat('');
    }
  }

  useEffect(() => {
    fetchLastNomor();
  }, []);

  useEffect(() => {
    fetchLastNomor().then(() => {
      parseNomorSurat();
    });
  }, [lastNomorSurat, tglTerbit, data?.rsiap?.access_token]);

  const parseNomorSurat = () => {
    let nomorSurat = 0;
    
    if (lastNomorSurat){
      const splitNomorSurat = lastNomorSurat.split('/');
      nomorSurat = isNaN(parseInt(splitNomorSurat[0]))
        ? 1
        : parseInt(splitNomorSurat[0]) + 1;
    } else {
      nomorSurat = 1;
    }

    const ns = nomorSurat.toString().padStart(3, '0');

    const tgl = tglTerbit
      ? new Date(tglTerbit).toLocaleDateString('id-ID', { day: '2-digit' })
      : new Date().toLocaleDateString('id-ID', { day: '2-digit' });
    const bulan = tglTerbit
      ? new Date(tglTerbit).toLocaleDateString('id-ID', { month: '2-digit' })
      : new Date().toLocaleDateString('id-ID', { month: '2-digit' });
    const tahun = tglTerbit
      ? new Date(tglTerbit).toLocaleDateString('id-ID', { year: '2-digit' })
      : new Date().toLocaleDateString('id-ID', { year: '2-digit' });

    const nomor = `${ns}/B/S-RSIA/${tgl}${bulan}${tahun}`;
    setNewNomorSurat(nomor);
  };

  const onFormAddSuratEksternalSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as any);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/surat/eksternal/create`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${data?.rsiap?.access_token}`,
        },
        body: formData,
      }
    );

    const result = await response.json();
    if (result.success) {
      toast.success('Surat eksternal berhasil ditambahkan.');
      await new Promise((r) => setTimeout(r, 2000));
      router.push('/surat/eksternal');
    } else {
      if (typeof result.message === 'object') {
        Object.entries(result.message).forEach(([key, value]) => {
          toast.error(`${key}: ${value}`);
        });
      } else {
        toast.error(result.message);
      }
    }
  };

  const KaryawanColumns = [
    {
      name: 'Nama',
      selector: 'nama',
      data: (row: any) => (
        <div className='flex items-center gap-4'>
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
          <label
            htmlFor={row.nik}
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            <div>{row.nama}</div>
            <div className='mt-1'>
              <Badge variant='secondary' className='cursor-pointer'>
                {row.nik}
              </Badge>
            </div>
          </label>
        </div>
      ),
    },
    {
      name: 'Bidang',
      selector: 'bidang',
      data: (row: any) => <div>{row.bidang}</div>,
    },
    {
      name: 'Jabatan',
      selector: 'jabatan',
      data: (row: any) => <div>{row.jbtn}</div>,
    },
    {
      name: 'Departemen',
      selector: 'departemen',
      data: (row: any) => <div>{row.dpt.nama}</div>,
    },
  ];

  return (
    <form action='#!' method='post' onSubmit={onFormAddSuratEksternalSubmit}>
      <div className='grid gap-3 py-4'>
        <div className='w-full space-y-1'>
          <Label className='text-primary' htmlFor='no_surat'>
            Nomor Surat
          </Label>
          <Input
            type='text'
            name='no_surat'
            placeholder='nomor surat'
            id='no_surat'
            value={newNomorSurat}
            onChange={(e) => setLastNomorSurat(e.target.value)}
            readOnly
          />
          <p className='no_surat-error text-xs text-danger'></p>
        </div>
        <div className='flex flex-col gap-4 md:flex-row'>
          <div className='w-[60%] space-y-1'>
            <Label className='text-primary' htmlFor='tgl_terbit'>
              Tannggal Terbit
            </Label>
            <Input
              type='date'
              name='tgl_terbit'
              placeholder='tanggal terbit surat'
              id='tgl_terbit'
              defaultValue={tglTerbit}
              onChange={(e) => setTglTerbit(e.target.value)}
            />
            <p className='tanggal-terbit-error text-xs text-danger'></p>
          </div>
          <div className='w-[60%] space-y-1'>
            <Label className='text-primary' htmlFor='tanggal'>
              Tannggal Surat
            </Label>
            <Input
              type='datetime-local'
              name='tanggal'
              placeholder='Tanggal Kegiatan'
              id='tanggal'
              defaultValue={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
            />
            <p className='tanggal-error text-xs text-danger'></p>
          </div>
          <div className='w-full space-y-1'>
            <Label className='text-primary' htmlFor='PJ'>
              Penanggung Jawab
            </Label>
            <Input type='hidden' name='pj' value={selectedPj} />
            <Combobox
              items={penanggungJawab.penanggungJawab}
              setSelectedItem={setSelectedPj}
              placeholder='Pilih Penanggung Jawab'
            />
            <p className='pj-error text-xs text-danger'></p>
          </div>
        </div>
        <div className='w-full space-y-1'>
          <Label className='text-primary' htmlFor='alamat'>
            Alamat
          </Label>
          <Input
            type='text'
            name='alamat'
            placeholder='alamat yang dituju'
            id='alamat'
          />
          <p className='alamat-error text-xs text-danger'></p>
        </div>
        <div className='w-full space-y-1'>
          <Label className='text-primary' htmlFor='perihal'>
            Perihal
          </Label>
          <Input
            type='text'
            name='perihal'
            placeholder='Perihal Surat'
            id='perihal'
          />
          <p className='perihal-error text-xs text-danger'></p>
        </div>
      </div>

      <div className='mt-10 flex justify-end'>
        <Button type='submit'>Simpan</Button>
      </div>
    </form>
  );
}
