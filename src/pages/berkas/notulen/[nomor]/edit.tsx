import { ReactElement, useState } from 'react';
import { useRouter } from 'next/router';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { IconArrowLeft } from '@tabler/icons-react';
import { Label } from '@/components/ui/label';
import { getSession } from 'next-auth/react';
import { getFullDateWithDayName } from '@/lib/date';

import dynamic from 'next/dynamic';

const AppLayout = dynamic(() => import('@/components/layouts/app'), {
  ssr: false,
});
const FormAddNotulen = dynamic(
  () => import('@/components/custom/forms/add-notulen'),
  { ssr: false }
);

const EditNotulenPage = (props: any) => {
  const { nomor, data, notulen } = props;
  const router = useRouter();

  const [surat, setSurat] = useState(data.success ? data.data : null);
  const [notulenData, setNotulenData] = useState(
    notulen.success ? notulen.data : null
  );

  return (
    <div className='flex flex-col gap-3'>
      <Card>
        <CardHeader className='p-3'>
          <div className='flex items-center gap-4'>
            <Button
              type='button'
              variant='outline'
              size='icon'
              onClick={() => router.back()}
            >
              <IconArrowLeft className='rotate-0 scale-100 transition-all' />
            </Button>
            <div className='flex flex-col gap-0.5'>
              <CardTitle className='text-primary'>Edit Notulen</CardTitle>
              <CardDescription>
                Edit notulen kegiatan |{' '}
                <strong>RSIA Aisyiyah Pekajangan</strong>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className='flex flex-col-reverse items-start gap-3 md:flex-row'>
        <Card className='w-full'>
          <CardHeader>
            <CardTitle>Form Edit Notulen</CardTitle>
            <CardDescription>
              Untuk membuat notulen, silahkan isi form berikut ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormAddNotulen nomor={nomor} notulen={notulenData} />
          </CardContent>
        </Card>

        <Card className='w-full bg-secondary md:w-[50%]'>
          <CardHeader>
            <CardTitle>Informasi Kegiatan</CardTitle>
            <CardDescription>
              Berikut ini adalah informasi kegiatan yang akan dibuat notulen
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data?.success ? (
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col items-start gap-1'>
                  <Label htmlFor='no_surat' className='text-primary'>
                    No. Surat
                  </Label>
                  {nomor}
                </div>
                <div className='flex flex-col items-start gap-1'>
                  <Label htmlFor='perihal' className='text-primary'>
                    Perihal
                  </Label>
                  <p className='m-0 p-0'>{surat.perihal}</p>
                </div>
                <div className='flex flex-col items-start gap-1'>
                  <Label htmlFor='pj' className='text-primary'>
                    Penanggung Jawab
                  </Label>
                  <p className='m-0 p-0'>{surat.pj_detail.nama}</p>
                </div>
                <div className='flex flex-col items-start gap-1'>
                  <Label htmlFor='pj' className='text-primary'>
                    Waktu Kegiatan
                  </Label>
                  <p className='m-0 p-0'>
                    {getFullDateWithDayName(surat.tanggal)}
                  </p>
                </div>
              </div>
            ) : (
              <p>Notulen tidak ditemukan</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  // get nomor from url
  const { nomor } = context.query;
  const session = await getSession(context);

  const nomorSurat = nomor.replaceAll('--', '/');

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/surat/internal/detail/simple?nomor=${nomorSurat}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.rsiap?.access_token}`,
      },
    }
  ).then((res) => res.json());

  const resNotulen = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/berkas/notulen/${nomor}/show`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.rsiap?.access_token}`,
      },
    }
  ).then((res) => res.json());

  return {
    props: {
      data: response,
      notulen: resNotulen,
      nomor: nomorSurat,
    },
  };
}

EditNotulenPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default EditNotulenPage;
