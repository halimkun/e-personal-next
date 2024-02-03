import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { getFullDateWithDayName } from "@/lib/date"

import dynamic from "next/dynamic"

const LaravelPagingx = dynamic(() => import('@/components/custom-ui/laravel-paging'), { ssr: false })

interface MemoInternalTableProps {
  data: any
  filterData: any
  setFilterData: any
  isValidating: boolean | undefined
  onRowClick?: (row: any) => void;
  setSelectedItem?: (value: any) => void
  lastColumnAction?: boolean | undefined
}

const TablesMemoInternal = ({ data, filterData, setFilterData, isValidating, onRowClick = () => { }, setSelectedItem = () => { }, lastColumnAction }: MemoInternalTableProps) => {
  const [selectedJenis, setSelectedJenis] = useState<string | undefined>(undefined);
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
          setSelectedItem(item)
          onRowClick(item)
        }}
        lastColumnAction={lastColumnAction}
      />
    </>
  )
}

export default TablesMemoInternal;