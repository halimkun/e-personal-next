import React, { ReactElement } from 'react';
import { NextPageWithLayout } from '../_app';
import AppLayout from '@/components/layouts/app';

const BerkasKaryawanPage: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Berkas Karyawan page</h1>
    </div>
  );
};

BerkasKaryawanPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default BerkasKaryawanPage;
