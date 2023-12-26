import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { createRoot } from 'react-dom/client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import PDFFile from '@/templates/pdf/spo'
import { PDFViewer } from '@react-pdf/renderer';
import { getSession } from "next-auth/react"


interface ModalViewSpoProps {
  show: boolean,
  onHide: () => void,
  spo: any
}

const PDFnya = (data: any) => (
  <PDFViewer showToolbar={false} className='w-full h-full'>
    <PDFFile detail={data.detail} />
  </PDFViewer>
)

const ModalViewSpo = (props: ModalViewSpoProps) => {
  const { show, onHide, spo } = props

  const router = useRouter()
  const [detailSpo, setDetailSpo] = useState<any>([])

  useEffect(() => {
    const getDetailSpo = async () => {
      const session = await getSession()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/berkas/spo/show?nomor=${spo.nomor}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session?.rsiap?.access_token}`
        }
      })

      const data = await res.json() 
      if (data.success) {
        setDetailSpo(data.data)
      }
    }

    if (spo.nomor !== undefined || spo.nomor !== null) {
      getDetailSpo()
    }
  }, [spo])

  // useEffect(() => {
  //   if (detailSpo.nomor !== undefined || detailSpo.nomor !== null) {
  //     createRoot(document.getElementById('renderPDF') as HTMLElement).render(
  //       <PDFnya detail={detailSpo} />
  //     )

  //     ReactDOM.render(
  //       <PDFnya detail={detailSpo} />, 
  //       document.getElementById('renderPDF')
  //     )
  //   }
  // }, [detailSpo])

  return (
    <Dialog open={show} onOpenChange={onHide}>
      <DialogContent className="max-w-2xl">
        <div className="w-full max-h-[85vh] bg-white" id="renderPDF">
          {detailSpo.detail != undefined || detailSpo.detail != null ? (
            <PDFnya detail={detailSpo} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-xl font-medium text-gray-400">Tidak ada data SPO yang ditampilkan</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ModalViewSpo