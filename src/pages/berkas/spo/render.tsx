import PDFFile from '@/templates/pdf/spo'
import { createRoot } from 'react-dom/client'
import { PDFViewer } from '@react-pdf/renderer';
import { ReactElement, useEffect, useState } from 'react';
import AppLayout from '@/components/layouts/app';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import SPOHtml from '@/templates/pdf/spo-html';


const RenderPage = () => {
  const router = useRouter()
  const { nomor } = router.query
  const [spoDetail, setSpoDetail] = useState<any>(null)

  // useEffect(() => {
  //   if (spoDetail) {
  //     createRoot(document.getElementById('renderPDF') as HTMLElement).render(
  //       <PDFnya detail={spoDetail} />
  //     )
  //   }
  // }, [spoDetail])

  useEffect(() => {
    const getSpoDetail = async () => {
      const session = await getSession()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/berkas/spo/show?nomor=${nomor}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session?.rsiap?.access_token}`
        }
      })

      const data = await res.json()
      if (data.success) {
        setSpoDetail(data.data)
      }
    }

    getSpoDetail()
  }, [nomor])

  return (
    <div className="h-full flex items-center">
      <SPOHtml data={spoDetail} />
    </div>
  )
}

// const PDFnya = (data: any) => (
//   <PDFViewer showToolbar={false} className='w-full h-full'>
//     <PDFFile detail={data.detail}/>
//   </PDFViewer>
// )

RenderPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default RenderPage