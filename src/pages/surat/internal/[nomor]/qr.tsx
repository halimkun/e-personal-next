import React, { useEffect } from 'react';
import { useQRCode } from 'next-qrcode';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/router';

const QRUndanganPage = ({ nomor }: { nomor: string }) => {
  const { Canvas } = useQRCode();
  const router = useRouter();

  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center gap-4 bg-gray-100 dark:bg-gray-900 dark:text-white'>
      <Card className='shadow-none'>
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
              <CardTitle className='text-primary'>
                Kembali ke aplikasi
              </CardTitle>
              <CardDescription>
                QR Code kehadiran | <strong>RSIA Aisyiyah Pekajangan</strong>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className='overflow-hidden rounded-xl border border-border'>
        <Canvas
          text={nomor}
          logo={{
            src: 'http://192.168.100.33/rsiap-api/public/images/logo.png',
            options: {
              width: 100,
            },
          }}
          options={{
            errorCorrectionLevel: 'M',
            margin: 2,
            scale: 4,
            width: 400,
            color: {
              dark: '#222222',
              light: '#FFFFFF',
            },
          }}
        />
      </div>

      <div className='text-center'>
        <h1 className='text-2xl font-bold'>Scan QR Code</h1>
        <p>Untuk konfirmasi kehadiran</p>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const { nomor } = context.query;

  const nomorSurat = nomor.replaceAll('--', '/');

  return {
    props: {
      nomor: nomorSurat,
    },
  };
}

export default QRUndanganPage;
