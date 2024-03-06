import useSWR from 'swr';
import dynamic from 'next/dynamic';

import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

import { cn } from '@/lib/utils';
import { getDate, getTime } from '@/lib/date';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NextPageWithLayout } from '@/pages/_app';
import {
  IconArrowLeft,
  IconInfoCircle,
  IconLoader,
  IconNote,
} from '@tabler/icons-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Loading1 = dynamic(() => import('@/components/custom/icon-loading'), {
  ssr: false,
});
const AppLayout = dynamic(() => import('@/components/layouts/app'), {
  ssr: false,
});

const DetailSuratInternal: NextPageWithLayout = ({ nomor }: any) => {
  const route = useRouter();
  const fetcher = async (url: string) => {
    const session = await getSession();
    if (route.isReady) {
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.rsiap?.access_token}`,
        },
        body: JSON.stringify({
          nomor: nomor,
        }),
      }).then((res) => res.json());
    }
  };

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/surat/internal/detail`,
    fetcher
  );

  if (isLoading) return <Loading1 height={50} width={50} />;
  if (error) return <div>{error.message}</div>;
  if (!data) return <div>No data</div>;

  const detail = data.data;

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => route.push('/surat/internal')}
          >
            <IconArrowLeft className='rotate-0 scale-100 transition-all' />
          </Button>
          <div className='flex flex-col gap-0.5'>
            <CardTitle>Detail Surat Internal</CardTitle>
            <CardDescription>
              Detail Surat Internal dengan nomor{' '}
              <Badge variant='outline' className='ml-2'>
                {detail.no_surat}
              </Badge>{' '}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='mt-4'>
          <div className='flex flex-col items-start justify-start gap-3 lg:flex-row'>
            <table className='table w-full'>
              <tr>
                <th className='text-left'>Nomor Surat</th>
                <th>:</th>
                <td className='p-2'>{nomor}</td>
              </tr>
              <tr>
                <th className='text-left'>Perihal</th>
                <th>:</th>
                <td className='p-2'>{detail.perihal}</td>
              </tr>
              <tr>
                <th className='text-left'>Penanggung Jawab</th>
                <th>:</th>
                <td className='p-2'>
                  {detail.pj_detail ? detail.pj_detail.nama : detail.pj}
                </td>
              </tr>
              <tr>
                <th className='text-left'>Tempat</th>
                <th>:</th>
                <td className='p-2'>{detail.tempat}</td>
              </tr>
              <tr>
                <th className='text-left'>Tanggal</th>
                <th>:</th>
                <td className='p-2'>
                  {getDate(detail.tanggal)} {getTime(detail.tanggal)}
                </td>
              </tr>
              <tr>
                <th className='text-left'>Status</th>
                <th>:</th>
                <td className='p-2'>
                  <div className='flex items-center gap-3'>
                    <div
                      className={cn(
                        'flex items-center justify-center rounded-full px-3 text-sm',
                        {
                          'border-2 border-green-500 bg-green-200 text-green-800':
                            detail.status === 'disetujui',
                          'border-2 border-red-500 bg-red-200 text-red-800':
                            detail.status === 'ditolak',
                          'border-2 border-yellow-500 bg-yellow-200 text-yellow-800':
                            detail.status === 'pengajuan',
                        }
                      )}
                    >
                      {detail.status}
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <th className='text-left'>Jumlah Penerima</th>
                <th>:</th>
                <td className='p-2'>{detail.penerima.length}</td>
              </tr>
            </table>

            <Alert className='w-[60%]'>
              <IconInfoCircle className='h-5 w-5' />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                You can add components to your app using the cli.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        <div className='mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
          {detail.penerima.map((item: any, index: number) => (
            <div
              className='rounded border border-border p-3 transition-all duration-150 ease-in-out hover:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900'
              key={index}
            >
              <div className='font-bold'>
                {item.pegawai ? item.pegawai.nama : item.penerima}
              </div>
              <div className='text-sm text-gray-500'>
                {item.pegawai ? item.penerima : '-'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

DetailSuratInternal.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export async function getServerSideProps(ctx: any) {
  const nomor = ctx.query.nomor?.toString().replace(/_/g, '/');

  return {
    props: {
      nomor: nomor,
    },
  };
}

export default DetailSuratInternal;
