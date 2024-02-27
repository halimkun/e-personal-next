import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconFileSearch } from "@tabler/icons-react"

interface ColumnsSuratMasukProps {
  setIsOpenPreview: (value: boolean) => void
  setSelectedItem: (value: any) => void
  getIconFromKetSurat: (ket_surat: string) => any
}

export const ColumnsSuratMasuk = (props: ColumnsSuratMasukProps) => [
  {
    name: 'No SIMRS',
    selector: 'no_simrs',
    data: (row: any) => <Badge variant={'outline'}>{new Date(row.no_simrs).toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' })}</Badge>,
  },
  {
    name: 'Perihal',
    selector: 'perihal',
    enableHiding: false,
    data: (row: any) => (
      // Gunakan props di sini jika diperlukan
      <div className="flex flex-row items-center gap-4">
        <div>{row.ket ? props.getIconFromKetSurat(row.ket) : null}</div>
        <div className="flex flex-col">
          <span className="font-semibold">{row.perihal}</span>
          <div>
            {row.no_surat ? <Badge variant={'secondary'} className="mt-1">{row.no_surat}</Badge> : null}
          </div>
        </div>
      </div>
    ),
  },
  {
    name: 'Pengirim',
    selector: 'pengirim',
    data: (row: any) => <p className="text-sm">{row.pengirim}</p>,
  },
  {
    name: 'Tanggal Surat',
    selector: 'tgl_surat',
    data: (row: any) => row.tgl_surat && row.tgl_surat != '0000-00-00' ? <p className="text-sm whitespace-nowrap">{new Date(row.tgl_surat).toLocaleDateString('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })}</p> : '-',
  },
  {
    name: "#",
    selector: 'preview',
    data: (row: any) => (
      // Gunakan props di sini jika diperlukan
      <div className="w-full flex justify-end">
        <Button
          size="icon"
          className="h-6 w-6"
          disabled={!row.berkas || row.berkas == '-' || row.berkas == '' || row.berkas == ' '}
          onClick={(e) => {
            // Gunakan props di sini jika diperlukan
            props.setSelectedItem(row);
            props.setIsOpenPreview(true);
          }}
        >
          <IconFileSearch className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];
