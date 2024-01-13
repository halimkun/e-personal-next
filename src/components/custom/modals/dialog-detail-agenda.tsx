import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/router"
import toast from "react-hot-toast"

interface DialogDetailAgendaProps {
  evt: any
  setEvt: any
  detail: boolean
  setDetail: any
}

const DialogDetailAgenda = (props: DialogDetailAgendaProps) => {

  const { evt, setEvt, detail, setDetail } = props
  return (
    <Dialog open={detail} onOpenChange={setDetail}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-primary leading-6'>{evt.title}</DialogTitle>
          <DialogHeader><span className="text-sm text-gray-600 dark:text-gray-500">{evt.resource?.no_surat}</span></DialogHeader>
        </DialogHeader>

        <table className="table w-full text-left mb-5">
          <tr>
            <th>Penanggung Jawab</th>
            <th>:</th>
            <td>{evt.resource?.pj_detail ? evt.resource?.pj_detail.nama : evt.resource?.pj}</td>
          </tr>
          <tr>
            <th>Tempat</th>
            <th>:</th>
            <td>{evt.resource?.tempat}</td>
          </tr>
          <tr>
            <th>Tanggal</th>
            <th>:</th>
            <td>{new Date(evt.resource?.tanggal).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} - {new Date(evt.resource?.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</td>
          </tr>
          <tr>
            <th>Status</th>
            <th>:</th>
            <td>{evt.resource?.status}</td>
          </tr>

          {evt.resource?.keterangan && (
            <tr>
              <th>Keterangan</th>
              <th>:</th>
              <td>{evt.resource?.keterangan}</td>
            </tr>
          )}
        </table>

        {!evt.resource?.hasSurat && (
          // button edit and delete 
          <div className="flex gap-4">
            <Button
              className="w-full"
              variant="default"
              onClick={() => {
                toast.error('Fitur ini belum tersedia')
              }}
            >
              Edit
            </Button>
            <Button
              className="w-full"
              variant="destructive"
              onClick={() => {
                toast.error('Fitur ini belum tersedia')
              }}
            >
              Hapus
            </Button>
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => {
                toast.error('Fitur ini belum tersedia')
              }}
            >
              status
            </Button>
          </div>
        )}
        {evt.resource?.hasSurat ? (
          <Button onClick={() => {
            const url = `surat/internal/${evt.resource?.no_surat.replace(/\//g, '_')}/detail`
            window.open(url, '_blank')
          }}>Lihat Surat</Button>
        ) : (
          <Button disabled>Lihat Surat</Button>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default DialogDetailAgenda