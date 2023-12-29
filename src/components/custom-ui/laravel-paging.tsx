import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "../ui/input";
import { Combobox } from "../custom/inputs/combo-box";


const LaravelPagingx = ({ data, columnsData, filterData, setFilterData, ...props }: any) => {
  return (
    <>
      <div className="mb-4 w-full flex items-center justify-end gap-4">
        <div>
          <Combobox
            items={[
              { value: '', label: 'Semua Data'},
              { value: 'A', label: 'SK Dokumen' },
              { value: 'B', label: 'SK Pengangkatan Jabatan' },
            ]}
            setSelectedItem={(item: any) => {
              setFilterData({ ...filterData, jenis: item })
            }}
            selectedItem={filterData.jenis}
            placeholder="Jenis SK"
          />
        </div>
        <div>
          <Input
            type="search"
            placeholder="Search..."
            className="w-full min-w-[250px]"
            onChange={(e) => {
              setFilterData({ ...filterData, keyword: e.target.value })
            }}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {columnsData.map((column: any) => (
              <TableHead key={column.name}>{column.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((d: any) => (
            <TableRow key={d?.no_surat} className="group">
              {columnsData.map((column: any, index: number) => (
                <TableCell key={column.selector}>
                  {column.data(d)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center w-full mt-6">
        {/* left info */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Showing {data?.from} to {data?.to} of {data?.total} entries <br />
            Page {data?.current_page} of {data?.last_page}
          </span>
        </div>

        {/* right pagination next and prefv */}
        <div className="flex items-center gap-2">
          <Button type="button" variant="default" size="icon" className="w-7 h-7" disabled={data?.prev_page_url === null}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.707 4.293a1 1 0 010 1.414L7.414 10l3.293 3.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </Button>

          <Button type="button" variant="default" size="icon" className="w-7 h-7" disabled={data?.next_page_url === null}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[1.2rem] w-[1.2rem] rotate-180 scale-100 transition-all" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.707 4.293a1 1 0 010 1.414L7.414 10l3.293 3.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
      </div>
    </>
  )
}

export default LaravelPagingx;