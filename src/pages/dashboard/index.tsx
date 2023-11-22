import React, { ReactElement } from 'react';
import { NextPageWithLayout } from '../_app';
import AppLayout from '@/components/layouts/app';

const DashboardPage: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default DashboardPage;
