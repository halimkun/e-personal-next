import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Combobox } from "../inputs/combo-box"
import { useState } from "react"

import LaravelPagingx from "@/components/custom-ui/laravel-paging"

interface SuratInternalProps {
  data: any
  columns: any
  filterData: any
  setFilterData: any
  isValidating: boolean | undefined
  onRowClick?: (row: any) => void;
  setSelectedItem?: (value: any) => void
  lastColumnAction?: boolean | undefined
}

const TabelSuratInternal = ({
  data,
  columns,
  filterData,
  setFilterData,
  isValidating,
  onRowClick = () => { },
  setSelectedItem = () => { },
  lastColumnAction
}: SuratInternalProps) => {

  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);

  return (
    <>
      <div className="mt-4 mb-4 w-full flex flex-col md:flex-row items-center justify-end gap-4 p-4 rounded-xl bg-gray-100/50 dark:bg-gray-900/50 border border-border">
        <div className="w-full space-y-1">
          <Label>Tanggal Surat</Label>
          <Combobox items={[
            { label: "Semua", value: "" },
            { label: "Disetujui", value: "disetujui" },
            { label: "Pengajuan", value: "pengajuan" },
            { label: "Ditolak", value: "ditolak" }
          ]} setSelectedItem={
            (value: any) => {
              setSelectedStatus(value)
              setFilterData({ ...filterData, status: value })
            }
          } selectedItem={selectedStatus} placeholder="Pilih Status" />
        </div>
        <div className="w-full space-y-1">
          <Label>Tanggal Surat</Label>
          <Input
            type="date"
            className="w-full"
            name='tgl_terbit'
            onChange={(e) => {
              setFilterData({ ...filterData, tgl_terbit: e.target.value })
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
        lastColumnAction={lastColumnAction}
      />
    </>
  )
}

export default TabelSuratInternal;