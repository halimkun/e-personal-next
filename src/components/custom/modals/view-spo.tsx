import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"

import PDFFile from '@/templates/pdf/spo'
import { PDFViewer } from '@react-pdf/renderer';
import { getSession } from "next-auth/react"
import SPOHtml from "@/templates/pdf/spo-html"


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

  return (
    <Dialog open={show} onOpenChange={onHide}>
      <DialogContent className="max-w-4xl">
        <div className="w-full max-h-[85vh] bg-background" id="renderPDF">
          {detailSpo.detail != undefined || detailSpo.detail != null ? (
            <div className="h-full flex items-start overflow-scroll">
              <SPOHtml data={detailSpo} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-xl font-medium">Isi atau detail SPO belum tersedia</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ModalViewSpo