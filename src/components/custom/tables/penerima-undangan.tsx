import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

import dynamic from "next/dynamic"

const LaravelPagingx = dynamic(() => import('@/components/custom-ui/laravel-paging'), { ssr: false })

interface PenerimaUndanganProps {
  data: any,
  setKaryawanHadir?: any,
  filterData: any,
  setFilterData: any
}

const PenerimaUndanganTable = ({ data, setKaryawanHadir, filterData, setFilterData }: PenerimaUndanganProps) => {

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

      <LaravelPagingx
        data={penerima}
        columnsData={columns}
        filterData={filterData}
        setFilterData={setFilterData}
      />
    </div>
  )
}

export default PenerimaUndanganTable;