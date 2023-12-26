import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { IconDownload, IconEdit, IconFileSearch, IconTrash } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getFullDate } from "@/lib/date"
import { PDFDownloadLink, Document } from "@react-pdf/renderer"
import SeparatorWithText from "../separator-with-text"
import { toast } from "react-hot-toast"
import { useRouter } from "next/router"

import PDFFile from "@/templates/pdf/spo"

interface DialogMenuSpoProps {
  isMenuOpen: boolean
  setIsMenuOpen: (value: boolean) => void
  spo: any
  onDelete: () => void
  spoDetail: any
  setIsFormEditOpen: (value: boolean) => void
  setIsViewSpoOpen: (value: boolean) => void
}

const DialogMenuSpo = (props: DialogMenuSpoProps) => {
  const router = useRouter()
  const { isMenuOpen, setIsMenuOpen, spo, onDelete, spoDetail, setIsFormEditOpen, setIsViewSpoOpen } = props

  return (
    <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Menu Standar Prosedur Operasional</DialogTitle>
          <DialogDescription>
            <Badge variant={'outline'}>{spo.nomor}</Badge>
            Anda dapat memilih menu dibawah ini untuk melakukan aksi pada SPO terpilih.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 space-y-2 text-left">
          <table className="table w-full">
            <tbody>
              <tr>
                <th>Nomor</th>
                <th>:</th>
                <td>{spo.nomor}</td>
              </tr>
              <tr>
                <th>Judul</th>
                <th>:</th>
                <td>{spo.judul}</td>
              </tr>
              <tr>
                <th>Unit</th>
                <th>:</th>
                <td>{spo.departemen ? spo.departemen.nama : spo.unit}</td>
              </tr>
              <tr>
                <th>Tanggal Terbit</th>
                <th>:</th>
                <td>{getFullDate(spo.tgl_terbit)}</td>
              </tr>
              <tr>
                <th>Jenis</th>
                <th>:</th>
                <td>{spo.jenis}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-between w-full">
          <div className="flex justify-end gap-2 w-full">
            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => {
              setIsMenuOpen(false)
              setIsFormEditOpen(true)
            }}>
              <IconEdit className="h-4 w-4" /> Edit
            </Button>
            <Button variant="destructive" size="sm" className="flex items-center gap-2" onClick={() => window.confirm('Apakah anda yakin ingin menghapus data ini?') && onDelete()}>
              <IconTrash className="h-4 w-4" /> Hapus
            </Button>
          </div>
        </div>

        <SeparatorWithText text="spo detail" />
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => router.push(`/berkas/spo/${spo.nomor.replace(/\//g, '--')}`)}>
            <IconEdit className="h-4 w-4" /> Edit SPO
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => {
            setIsMenuOpen(false)
            setIsViewSpoOpen(true)
          }}>
            <IconFileSearch className="h-4 w-4" /> Lihat SPO
          </Button>
          {spoDetail && (
            <PDFDownloadLink document={spoDetail ? <PDFFile detail={spoDetail} key={spoDetail?.nomor} /> : <Document></Document>} fileName={`SPO-${spo.nomor}.pdf`}>
              {({ blob, url, loading, error }) => {
                if (error) return 'Terjadi kesalahan saat membuat dokumen'

                return loading ? (
                  <Button variant="outline" size="sm" className="flex items-center gap-2" disabled>
                    <IconDownload className="h-4 w-4" /> Loading...
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <IconDownload className="h-4 w-4" /> Download
                  </Button>
                )
              }}
            </PDFDownloadLink>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogMenuSpo