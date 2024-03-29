import { NextPageWithLayout } from '@/pages/_app';
import { IconLoader } from '@tabler/icons-react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';

import dynamic from 'next/dynamic';
import useSWR from 'swr';

const FormAddSuratInternal = dynamic(
  () => import('@/components/custom/forms/add-surat-internal'),
  { ssr: false }
);
const AppLayout = dynamic(() => import('@/components/layouts/app'), {
  ssr: false,
});

const SuratInternal: NextPageWithLayout = () => {
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
      <FormAddSuratInternal penanggungJawab={penanggungJawab} />
    </div>
  );
};

SuratInternal.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default SuratInternal;
