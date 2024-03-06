import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { IconInnerShadowTop } from '@tabler/icons-react';
import { getSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const FormUploadBerkasPegawai = ({ nik, setOpen }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [kategori, setKategori] = useState([]);
  const [berkas, setBerkas] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchKategori = async () => {
      const session = await getSession();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pegawai/berkas/kategori`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.rsiap?.access_token}`,
          },
        }
      );
      const data = await res.json();

      if (data.success) {
        setKategori(data.data);
      } else {
        toast.error('Gagal mengambil data kategori');
      }
    };

    fetchKategori();
  }, []);

  const fetchBerkas = async (kategori: string) => {
    setBerkas([]);
    const session = await getSession();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/pegawai/berkas/nama-berkas?kategori=${kategori}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.rsiap?.access_token}`,
        },
      }
    );
    const data = await res.json();

    if (data.success) {
      setBerkas(data.data);
    } else {
      toast.error('Gagal mengambil data berkas');
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const session = await getSession();
    const formData = new FormData(e.target);
    formData.append('nik', nik);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/pegawai/upload/berkas`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.rsiap?.access_token}`,
        },
        body: formData,
      }
    );
    const data = await res.json();

    if (data.success) {
      toast.success('Berkas berhasil diupload');

      router.replace(router.asPath);
      setOpen(false);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      toast.error(data.message);
    }
  };

  return (
    <form method='post' encType='multipart/form-data' onSubmit={handleSubmit}>
      <div className='grid gap-4'>
        <div className='flex gap-4'>
          <div className='grid w-full gap-2'>
            <Label htmlFor='kategori'>Kategori</Label>
            <Select
              onValueChange={(value) => fetchBerkas(value)}
              name='kategori-berkas'
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Pilih Kategori Berkas' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Kategori Berkas</SelectLabel>
                  {kategori.map((item: any) => (
                    <SelectItem key={item.kategori} value={item.kategori}>
                      {item.kategori}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className='grid w-full gap-2'>
            <Label htmlFor='berkas'>Berkas</Label>
            <Select name='berkas'>
              <SelectTrigger className='w-[100%] text-ellipsis whitespace-normal'>
                <SelectValue
                  placeholder='Berkas'
                  className='w-[100%] text-ellipsis'
                />
              </SelectTrigger>
              <SelectContent className='max-h-72 w-[100%] text-ellipsis'>
                <SelectGroup>
                  <SelectLabel>Jenis Berkas</SelectLabel>
                  {berkas.map((item: any) => (
                    <SelectItem
                      key={item.kode}
                      value={item.kode}
                      className='w-[100%] text-ellipsis'
                    >
                      {item.nama}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='pilih_berkas'>Pilih Berkas</Label>
          <Input id='pilih_berkas' type='file' name='file_berkas' />
        </div>

        <div className='flex items-center justify-end'>
          <Button type='submit' variant='default' disabled={isLoading}>
            {isLoading ? (
              <span className='flex w-full items-center justify-center gap-2'>
                <IconInnerShadowTop className='h-4 w-4 animate-spin' />{' '}
                Uploading . . .
              </span>
            ) : (
              'Upload'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormUploadBerkasPegawai;
