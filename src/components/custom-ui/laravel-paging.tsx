import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "../ui/skeleton";

interface tableProps {
  data: any
  columnsData: any
  filterData: any
  setFilterData: any
  isValidating?: boolean | undefined
  onRowClick?: (row: any) => void;
  lastColumnAction?: boolean | undefined
}

const LaravelPagingx = ({
  data,
  columnsData,
  filterData,
  setFilterData,
  isValidating,
  onRowClick,
  lastColumnAction = false
}: tableProps) => {
  return (
    <>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            {columnsData.map((column: any) => (
              <TableHead key={column.name}>{column.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isValidating ? (
            // Number(data.per_page)
            [...Array(Number(data.per_page))].map((_, index) => (
              <TableRow key={index}>
                {columnsData.map((column: any) => (
                  <TableCell key={column.selector}>
                    <Skeleton className="w-full h-4" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            data.data.map((d: any) => (
              <TableRow key={d?.no_surat} className="group" onClick={
                !lastColumnAction ? (
                  onRowClick ? (() => onRowClick?.(d)) : (() => { })
                ) : (() => { })
              }>
                {columnsData.map((column: any, index: number) => (
                  <TableCell key={column.selector} onClick={
                    lastColumnAction ? (
                      index === columnsData.length - 1 ? (() => { }) : (onRowClick ? (() => onRowClick?.(d)) : (() => { }))
                    ) : (() => { })
                  }>
                    {column.data(d)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center w-full mt-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Showing {data?.from} to {data?.to} of {data?.total} entries <br />
            Page {data?.current_page} of {data?.last_page}
          </span>
        </div>

        {/* right pagination next and prefv */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="default"
            size="icon"
            className="w-7 h-7"
            disabled={data?.prev_page_url === null}
            onClick={() => {
              if (data?.prev_page_url) {
                const url = new URL(data?.prev_page_url)
                const page = url.searchParams.get('page')

                setFilterData({ ...filterData, page: page })
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.707 4.293a1 1 0 010 1.414L7.414 10l3.293 3.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </Button>

          <Button
            type="button"
            variant="default"
            size="icon"
            className="w-7 h-7"
            disabled={data?.next_page_url === null}
            onClick={() => {
              if (data?.next_page_url) {
                const url = new URL(data?.next_page_url)
                const page = url.searchParams.get('page')

                setFilterData({ ...filterData, page: page })
              }
            }}
          >
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