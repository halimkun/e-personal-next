import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { getFullDateWithDayName } from "@/lib/date"

import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { IconPencilCog, IconTrash } from "@tabler/icons-react"
import { useRouter } from "next/router"
import { getSession } from "next-auth/react"
import toast from "react-hot-toast"

const LaravelPagingx = dynamic(() => import('@/components/custom-ui/laravel-paging'), { ssr: false })
const DialogMenuMemoInternal = dynamic(() => import('@/components/custom/modals/dialog-menu-memo-internal'), { ssr: false })

interface MemoInternalTableProps {
  data: any
  filterData: any
  setFilterData: any
  isValidating: boolean | undefined
  onRowClick?: (row: any) => void;
  setSelectedItem?: (value: any) => void
  lastColumnAction?: boolean | undefined
  mutate?: any
}

const TablesMemoInternal = ({ data, filterData, setFilterData, isValidating, onRowClick = () => { }, setSelectedItem = () => { }, lastColumnAction, mutate }: MemoInternalTableProps) => {
  const route = useRouter();

  const [items, setItems] = useState<any>({});
  const [openDialogMenu, setOpenDialogMenu] = useState<boolean>(false);
  const [selectedJenis, setSelectedJenis] = useState<string | undefined>(undefined);

  const onDelete = async (nomor: string) => {
    const confirm = window.confirm('Apakah anda yakin ingin menghapus data ini?')
    if (!confirm) return

    const session = await getSession()
    const forData = new FormData()

    forData.append('no_surat', nomor)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/berkas/memo/internal/delete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.rsiap?.access_token}`,
      },
      body: forData
    })

    const data = await response.json()

    console.log(data)

    if (data.success) {
      toast.success('Berhasil menghapus data')
      setSelectedItem({})
    }

    if (!data.success) {
      toast.error('Gagal menghapus data')
    }

    mutate()
  }

  const columns = [
    {
      name: 'No. Surat',
      selector: 'No Surat',
      enableHiding: false,
      data: (row: any) => <Badge variant={'secondary'}>{row.no_surat}</Badge>
    },
    {
      name: 'Perihal',
      selector: 'perihal',
      enableHiding: false,
      data: (row: any) => row.perihal.perihal
    },
    {
      name: 'Dari',
      selector: 'dari',
      enableHiding: false,
      data: (row: any) => (
        <>
          <Badge variant={'outline'}>{row.dari}</Badge>
        </>
      )
    },
    {
      name: 'Tgl Terbit',
      selector: 'tgl_terbit',
      enableHiding: false,
      data: (row: any) => (
        <Badge variant={'secondary'}>
          {getFullDateWithDayName(row.perihal.tgl_terbit)}
        </Badge>
      )
    },
    {
      // edit and delete
      name: '',
      selector: 'action',
      enableHiding: false,
      data: (row: any) => (
        <div className="flex gap-2 w-full justify-end">
          <Button
            size={'icon'}
            onClick={() => {
              const url = "/memo/internal/" + row.no_surat.toString().replaceAll('/', '--') + "/edit"
              route.push(url)
            }}
            className="bg-primary text-white hover:bg-primary-600 w-7 h-7"
          >
            <IconPencilCog size={18} />
          </Button>

          <Button
            size={'icon'}
            onClick={() => {
              onDelete(row.no_surat)
            }}
            className="bg-danger text-white hover:bg-danger-600 w-7 h-7"
          >
            <IconTrash size={18} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <>
      <div className="mt-4 mb-4 w-full flex flex-col md:flex-row items-center justify-end gap-4 p-4 rounded-xl bg-gray-100/50 dark:bg-gray-900/50 border border-border">
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
          setItems(item)
          setOpenDialogMenu(true)
        }}
        lastColumnAction={true}
      />

      <DialogMenuMemoInternal
        item={items}
        open={openDialogMenu}
        onOpenChange={(value: boolean) => setOpenDialogMenu(value)}
      />
    </>
  )
}

export default TablesMemoInternal;