import React, { ReactElement } from 'react';
import { NextPageWithLayout } from '../_app';
import AppLayout from '@/components/layouts/app';

const KaryawanPage: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Karyawan page</h1>
    </div>
  );
};

KaryawanPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default KaryawanPage;
