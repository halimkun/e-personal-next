import React, { ReactElement } from 'react';
import { NextPageWithLayout } from '../_app';
import AppLayout from '@/components/layouts/app';
import { Button } from '@/components/ui/button';
import { signIn, signOut, useSession } from 'next-auth/react';

const DashboardPage: NextPageWithLayout = () => {
  const { data } = useSession();

  return (
    <div>
      <h1>Dashboard</h1>
      {data?.rsiap?.access_token}
    </div>
  );
};

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default DashboardPage;
