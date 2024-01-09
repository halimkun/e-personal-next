import { Input } from "@/components/ui/input";
import { Combobox } from "../inputs/combo-box";
import LaravelPagingx from "@/components/custom-ui/laravel-paging";
import { Badge } from "@/components/ui/badge";
import { IconBrandWhatsapp, IconFile, IconFileSearch, IconFileText, IconHash, IconMail, IconPrinter } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface tableSuratMasukProps {
  data: any
  filterData: any
  setFilterData: any
  isValidating?: boolean | undefined
  setIsOpenPreview?: (value: boolean) => void
  setSelectedItem?: (value: any) => void
  onRowClick?: (row: any) => void;
  lastColumnAction?: boolean | undefined
}

function getIconFromKetSurat(ket_surat: string) {
  switch (ket_surat) {
    case 'wa':
    case 'whatsapp':
      return <IconBrandWhatsapp className="w-5 h-5 dark:stroke-green-500 stroke-green-500" />
    case 'fisik':
      return <IconFileText className="w-5 h-5 dark:stroke-yellow-500 stroke-yellow-500" />
    case 'email':
      return <IconMail className="w-5 h-5 dark:stroke-red-500 stroke-red-500" />
    case 'fax':
      return <IconPrinter className="w-5 h-5 dark:stroke-blue-500 stroke-blue-500" />
    case 'surat':
      return <IconFileText className="w-5 h-5 dark:stroke-yellow-500 stroke-yellow-500" />
    default:
      return <IconFile className="w-5 h-5 dark:stroke-gray-500 stroke-gray-500" />
  }
}

const TableSuratMasuk = ({ data,
  filterData,
  setFilterData,
  isValidating,
  setIsOpenPreview = () => { },
  setSelectedItem = () => { },
  onRowClick = () => { },
  lastColumnAction
}: tableSuratMasukProps) => {

  const columns = [
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
        <div className="flex flex-row items-center gap-4">
          <div>{row.ket ? getIconFromKetSurat(row.ket) : null}</div>
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
      name: <IconHash className="w-5 h-5" />,
      selector: 'preview',
      data: (row: any) => (
        <div className="w-full flex justify-end">
          <Button
            size="icon"
            className="h-6 w-6"
            disabled={!row.berkas || row.berkas == '-' || row.berkas == '' || row.berkas == ' '}
            onClick={(e) => {
              setSelectedItem(row)
              setIsOpenPreview(true)
            }}
          >
            <IconFileSearch className="w-4 h-4" />
          </Button>
        </div>
      ),
    }
  ]

  return (
    <>
      <div className="mt-4 mb-4 w-full flex flex-col md:flex-row items-center justify-end gap-4 p-4 rounded-xl bg-gray-100/50 border">
        <div className="w-full space-y-1">
          <Label>Dikirim Via</Label>
          <Combobox
            items={[
              { value: '', label: 'Semua' },
              { value: 'wa', label: 'WhatsApp' },
              { value: 'fisik', label: 'Fisik' },
              { value: 'email', label: 'Email' },
              { value: 'fax', label: 'FAX' },
            ]}
            setSelectedItem={(item: any) => {
              setFilterData({ ...filterData, via: item })
            }}
            selectedItem={filterData?.jenis}
            placeholder="Dikirim Via"
          />
        </div>
        <div className="w-full space-y-1">
          <Label>No. SIMRS</Label>
          <Input
            type="date"
            className="w-full"
            name='no_simrs'
            onChange={(e) => {
              setFilterData({ ...filterData, no_simrs: e.target.value })
            }}
          />
        </div>
        <div className="w-full space-y-1">
          <Label>Tanggal Surat</Label>
          <Input
            type="date"
            className="w-full"
            name='tgl_surat'
            onChange={(e) => {
              setFilterData({ ...filterData, tgl_surat: e.target.value })
            }}
          />
        </div>
        <div className="w-full space-y-1">
          <Label>Search</Label>
          <Input
            type="search"
            placeholder="Search..."
            className="w-full"
            defaultValue={filterData?.keyword}
            onChange={(e) => {
              setFilterData({ ...filterData, keyword: e.target.value })
            }}
          />
        </div>
      </div>

      <LaravelPagingx
        data={data.data}
        columnsData={columns}
        filterData={filterData}
        setFilterData={setFilterData}
        isValidating={isValidating}
        onRowClick={(item: any) => {
          setSelectedItem(item)
          onRowClick(item)
        }}
        lastColumnAction={true}
      />
    </>
  );
}

export default TableSuratMasuk;