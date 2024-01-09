import React from 'react'
import LaravelPagingx from '@/components/custom-ui/laravel-paging'
import { Badge } from '@/components/ui/badge'
import { Combobox } from '../inputs/combo-box'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


interface tableProps {
  data: any
  filterData: any
  setFilterData: any
  isValidating?: boolean
  onRowClick?: (row: any) => void;
}

const TableSk = ({ data, filterData, setFilterData, isValidating, onRowClick }: tableProps) => {
  const columns = [
    {
      name: 'Nomor',
      selector: 'nomor',
      enableHiding: false,
      style: ['w-[100px]'],
      data: (row: any) => (
        <Badge variant={row.status === '1' ? 'default' : 'destructive'}>
          {`${row.nomor.toString().padStart(3, '0')}/${row.jenis}/${row.prefix}/${new Date(row.tgl_terbit).toLocaleDateString('id-ID', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit'
          }).split('/').join('')}`}
        </Badge>
      ),
    },
    {
      name: 'Judul',
      selector: 'judul',
      enableHiding: false,
      data: (row: any) => <div>{row.judul}</div>,
    },
    {
      name: 'PJ',
      selector: 'pj',
      enableHiding: false,
      // data: (row: any) => <div>{<Badge variant="outline">{row.penanggungjawab.nama}</Badge>}</div>,
      data: (row: any) => row.penanggungjawab ? (
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant={"outline"} className="group-hover:border-primary">{row.pj}</Badge>
            </TooltipTrigger>
            <TooltipContent>{row.penanggungjawab.nama}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Badge variant="outline">{row.pj}</Badge>
      )
    },
    {
      name: 'Tgl Terbit',
      selector: 'tgl_terbit',
      enableHiding: false,
      data: (row: any) => <div>{new Date(row.tgl_terbit).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      })}</div>,
    },
  ]

  return (
    <>
      <div className="mt-4 mb-4 w-full flex flex-col md:flex-row items-center justify-end gap-4 bg-gray-100/50 dark:bg-gray-900/50 border border-border rounded-xl p-4">
        <div className="w-full space-y-1">
          <Label htmlFor="tgl_terbit">Tanggal Terbit</Label>
          <Input type="date" className="w-full" name='tgl_terbit' onChange={(e) => { setFilterData({ ...filterData, tgl_terbit: e.target.value }) }} />
        </div>
        <div className="w-full space-y-1">
          <Label htmlFor="">Jenis SK</Label>
          <Combobox
            items={[
              { value: '', label: 'Semua Data' },
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
        <div className="w-full space-y-1">
          <Label htmlFor="">Keywords</Label>
          <Input
            id='keyword'
            type="search"
            placeholder="Search..."
            className="w-full min-w-[250px]"
            defaultValue={filterData.keyword}
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
        onRowClick={onRowClick}
      />
    </>
  )
}

export default TableSk
