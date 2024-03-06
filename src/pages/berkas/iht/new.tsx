import dynamic from 'next/dynamic';

import { NextPageWithLayout } from '@/pages/_app';
import { ReactElement, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import toast from 'react-hot-toast';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const AppLayout = dynamic(() => import('@/components/layouts/app'), {
  ssr: false,
});
const FormAddPPI = dynamic(() => import('@/components/custom/forms/add-ppi'), {
  ssr: false,
});

const CreateBerkasRadiologiPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [selectedPJ, setSelectedPJ] = useState<any>('');
  const [tglTerbit, setTglTerbit] = useState<Date | null>(new Date());

  const onSubmit = async (e: any) => {
    e.preventDefault();
    var formData = new FormData(e.target);
    const session = await getSession();

    formData.append('pj', selectedPJ);
    formData.append('tgl_terbit', tglTerbit?.toISOString() || '');

    // post to /berkas/sertifikat/store
    toast.promise(
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/berkas/sertifikat/store`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.rsiap?.access_token}`,
        },
        body: formData,
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
          router.push(`/berkas/iht`);
          return 'Berhasil menyimpan data';
        },
        error: (err) => {
          return err?.message || 'Gagal menyimpan data';
        },
      }
    );
  };

  return (
    <div className='flex flex-col-reverse items-start gap-6 lg:flex-row'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='text-primary'>
            Form berkas / dokument{' '}
            <span className='font-bold'>in house training</span> (IHT)
          </CardTitle>
          <CardDescription>
            Form untuk menambahkan data berkas berkas / dokument{' '}
            <span className='font-bold'>in house training</span> (IHT)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormAddPPI
            onSubmitted={onSubmit}
            penanggungJawab={selectedPJ}
            setPenanggungJawab={setSelectedPJ}
            tglTerbit={tglTerbit}
            setTglTerbit={setTglTerbit}
          />
        </CardContent>
      </Card>

      <Card className='w-[50%]'>
        <CardHeader>
          <CardTitle className='text-primary'>Informasi</CardTitle>
          <CardDescription>
            Informasi tambahan untuk menambahkan data berkas berkas / dokument{' '}
            <span className='font-bold'>in house training</span> (IHT)
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
};

CreateBerkasRadiologiPage.getLayout = (page: ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export default CreateBerkasRadiologiPage;
