import useSWR from 'swr';
import dynamic from 'next/dynamic';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { NextPageWithLayout } from '@/pages/_app';
import { IconArrowLeft, IconLoader } from '@tabler/icons-react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';

const FormAddSuratEksternal = dynamic(
  () => import('@/components/custom/forms/add-surat-eksternal'),
  { ssr: false }
);
const AppLayout = dynamic(() => import('@/components/layouts/app'), {
  ssr: false,
});

const SuratEksternal: NextPageWithLayout = () => {
  const route = useRouter();
  const [penanggungJawab, setPenanggungJawab] = useState<any>([]);

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

        setPenanggungJawab(data);
      });

      return data;
    });
  };

  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/pegawai?datatables=1&with=bidang_detail&select=nik,nama`,
    fetchPegawai
  );

  if (error) return <div>Error {error.message}</div>;
  if (!data)
    return (
      <div className='flex h-full flex-col items-start justify-center gap-4'>
        <IconLoader className='h-7 w-7 animate-spin' />
      </div>
    );

  return (
    <div className='flex flex-col items-start gap-3 lg:flex-row'>
      <Card className='w-full'>
        <CardHeader>
          <div className='flex items-center gap-4'>
            <Button
              variant='outline'
              size='icon'
              onClick={() => route.push('/surat/eksternal')}
            >
              <IconArrowLeft className='rotate-0 scale-100 transition-all' />
            </Button>
            <div className='flex flex-col gap-0.5'>
              <CardTitle className='text-primary'>
                Buat Surat Eksternal Baru
              </CardTitle>
              <CardDescription>
                Buat surat eksternal baru |{' '}
                <strong>RSIA Aisyiyah Pekajangan</strong>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <FormAddSuratEksternal penanggungJawab={penanggungJawab} />
        </CardContent>
      </Card>

      <Card className='sticky top-[4.5rem] w-[40%]'>
        <CardHeader>
          <CardTitle className='text-primary'>Catatan</CardTitle>
          <CardDescription>
            Harap mengisi data dengan benar dan teliti.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

SuratEksternal.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default SuratEksternal;
