import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import dynamic from "next/dynamic"
import { useEffect, useState } from "react";

const LaravelPagingx = dynamic(() => import('@/components/custom-ui/laravel-paging'), { ssr: false })

interface PenerimaUndanganProps {
  data: any,
  setKaryawanHadir?: any
}

const PenerimaUndanganTable = ({ data, setKaryawanHadir }: PenerimaUndanganProps) => {

  const penerima = data.penerima;
  const [penerimaHadir, setPenerimaHadir] = useState<any[]>(data.penerimaHadir ?? []);

  useEffect(() => {
    setKaryawanHadir(penerimaHadir)
  }, [penerimaHadir])

  const columns = [
    {
      name: "",
      selector: 'pilih',
      data: (row: any) => (
        <div className="px-2">
          <Checkbox
            id={row.penerima}
            name="karyawan[]"
            value={row.penerima}
            checked={penerimaHadir.includes(row.penerima)}
            disabled={true}
            // onCheckedChange={() => {
            //   if (penerimaHadir.includes(row.penerima)) {
            //     setPenerimaHadir(penerimaHadir.filter((item: any) => item !== row.penerima))
            //   } else {
            //     setPenerimaHadir([...penerimaHadir, row.penerima])
            //   }
            // }}
          />
        </div>
      )
    },

    {
      name: 'Nama',
      selector: 'nama',
      data: (row: any) => (
        <div className="flex items-center gap-4">
          <label
            htmlFor={row.penerima}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-full"
          >
            <div className="font-bold">{row.pegawai.nama}</div>
          </label>
        </div>
      )
    },

    {
      name: 'NIK',
      selector: 'nik',
      data: (row: any) => (
        <>
          <div className="flex items-center gap-4">
            <label
              htmlFor={row.penerima}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-full"
            >
              <Badge variant="secondary" className="cursor-pointer">
                {row.penerima}
              </Badge>
            </label>
          </div>
        </>
      )
    },
  ];

  return (
    <div>
      <LaravelPagingx
        data={penerima}
        columnsData={columns}
        filterData={undefined}
        setFilterData={undefined}
      />
    </div>
  )
}

export default PenerimaUndanganTable;