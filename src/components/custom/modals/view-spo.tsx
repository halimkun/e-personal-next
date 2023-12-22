import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"


interface ModalViewSpoProps {
  show: boolean,
  onHide: () => void,
  spo: any
}

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

    getDetailSpo()
  }, [spo])

  const decodeHtml = (htmlString: string) => {
    if (typeof window === 'undefined') {
      console.warn("decodeHtml is running in a server environment. It may not work as expected.");
      return htmlString;
    }

    
    var txt = document.createElement("textarea");
    txt.innerHTML = htmlString;
    return txt.value;
  }
  return (
    <Dialog open={show} onOpenChange={onHide}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{detailSpo.judul}</DialogTitle>
          <DialogDescription>

            <div className="w-full flex justify-between items-center">
              <div className="flex gap-2">
                <Badge variant={'default'}>{detailSpo.nomor}</Badge>
                <div className="w-fit text-xs px-3 py-0.5 bg-primary/10 rounded-full text-primary border-2 border-primary font-bold">
                  {detailSpo.jenis}
                </div>
                <div className="w-fit text-xs px-3 py-0.5 bg-primary/10 rounded-full text-primary border-2 border-primary font-bold">
                  {detailSpo.tgl_terbit}
                </div>
              </div>
              
              <div className="w-fit text-xs px-3 py-0.5 rounded-full bg-primary/10 text-primary hover:bg-primary/30 border-2 border-primary font-bold cursor-pointer transition-all duration-150" onClick={() => router.push(`/berkas/spo/render?nomor=${detailSpo.nomor}`)}>lihat</div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh] pr-5">
          <div className="space-y-3 detail-spo">
            <div className="space-y-1">
              <h3 className="font-bold">Pengertian</h3>
              <div className="text-justify" dangerouslySetInnerHTML={{
                __html: decodeHtml(detailSpo.detail?.pengertian)
              }}></div>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold">Tujuan</h3>
              <div className="text-justify" dangerouslySetInnerHTML={{
                __html: decodeHtml(detailSpo.detail?.tujuan)
              }}></div>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold">Kebijakan</h3>
              <div dangerouslySetInnerHTML={{
                __html: decodeHtml(detailSpo.detail?.kebijakan)
              }}></div>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold">Prosedur</h3>
              <div dangerouslySetInnerHTML={{
                __html: decodeHtml(detailSpo.detail?.prosedur)
              }}></div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default ModalViewSpo