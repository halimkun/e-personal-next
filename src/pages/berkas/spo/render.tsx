import PDFFile from '@/templates/pdf/spo'
import AppLayout from '@/components/layouts/app';
import SPOHtml from '@/templates/pdf/spo-html';

import { createRoot } from 'react-dom/client'
import { PDFViewer } from '@react-pdf/renderer';
import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

const RenderPage = ({ data, isMobile }: any) => {
  // const router = useRouter()
  // const { nomor } = router.query
  // const [spoDetail, setSpoDetail] = useState<any>(null)

  // useEffect(() => {
  //   if (spoDetail) {
  //     createRoot(document.getElementById('renderPDF') as HTMLElement).render(
  //       <PDFnya detail={spoDetail} />
  //     )
  //   }
  // }, [spoDetail])

  return (
    <div className="h-full flex items-center px-4 py-5">
      <SPOHtml data={data} />
    </div>
  )
}

export async function getServerSideProps(context: any) {
  // fetch spo by nomor - spo/show?nomor
  const session = await getSession(context)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/berkas/spo/show?nomor=${context.query.nomor}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${session?.rsiap?.access_token}`
    }
  })

  const UA = context.req.headers['user-agent'];
  const isMobile = Boolean(UA.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  ))

  const data = await res.json()
  if (data.success) {
    return {
      props: {
        data: data.data,
        isMobile
      }
    }
  } else {
    return {
      props: {
        data: null,
        isMobile
      }
    }
  }
}

// const PDFnya = (data: any) => (
//   <PDFViewer showToolbar={false} className='w-full h-full'>
//     <PDFFile detail={data.detail}/>
//   </PDFViewer>
// )

// RenderPage.getLayout = function getLayout(page: ReactElement) {
//   return (
//     <AppLayout>{page}</AppLayout>
//   )
// }

export default RenderPage