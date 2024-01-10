import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import LaravelPagingx from "@/components/custom-ui/laravel-paging"

interface SuratEksternalProps {
  data: any
  columns: any
  filterData: any
  setFilterData: any
  isValidating: boolean | undefined
  onRowClick?: (row: any) => void;
  setSelectedItem?: (value: any) => void
  lastColumnAction?: boolean | undefined
}

const TabelSuratEksternal = ({
  data,
  columns,
  filterData,
  setFilterData,
  isValidating,
  onRowClick = () => { },
  setSelectedItem = () => { },
  lastColumnAction
}: SuratEksternalProps) => {
  return (
    <>
      <div className="mt-4 mb-4 w-full flex flex-col md:flex-row items-center justify-end gap-4 p-4 rounded-xl bg-gray-100/50 dark:bg-gray-900/50 border border-border">
        <div className="w-full space-y-1">
          <Label>Tanggal Surat</Label>
          <Input
            type="date"
            className="w-full"
            name='tanggal'
            onChange={(e) => {
              setFilterData({ ...filterData, tanggal: e.target.value })
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

export default TabelSuratEksternal;