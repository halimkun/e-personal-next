import type { ReactElement } from 'react'
import type { NextPageWithLayout } from '../_app';
import AppLayout from '@/components/layouts/app';
import SuratInternalView from '@/components/custom/views/surat-internal-views';

const SuratInternal: NextPageWithLayout = ({ data }: any) => {
  return <SuratInternalView data={data} />
};

export async function getServerSideProps(context: { req: any; res: any; }) {
  const token = context.req.cookies.access_token || '';
  const res = await fetch(`https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/surat/internal`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  const data = await res.json();

  return {
    props: {
      data: data.data
    }
  }
}

SuratInternal.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default SuratInternal;
