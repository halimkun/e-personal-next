import React from 'react'
import dynamic from 'next/dynamic'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconTrash } from '@tabler/icons-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const LaravelPagingx = dynamic(() => import('@/components/custom-ui/laravel-paging'), { ssr: false })

interface tablePpiProps {
  data: any
  filterData: any
  setFilterData: any
  mutate?: any
  isValidating?: boolean
  onRowClick?: (row: any) => void;
  onDelete: (row: any) => void;
}

const TablePPI = ({ data, filterData, mutate, setFilterData, isValidating, onRowClick, onDelete }: tablePpiProps) => {


  const columns = [
    {
      name: 'Nomor',
      selector: 'nomor',
      enableHiding: false,
      style: ['w-[100px]'],
      data: (row: any) => (
        <Badge variant={'secondary'} className='whitespace-nowrap'>
          {`${row.nomor.toString().padStart(3, '0')}/${row.prefix}/${new Date(row.tgl_terbit).toLocaleDateString('id-ID', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit'
          }).split('/').join('')}`}
        </Badge>
      ),
    },
    {
      name: 'Perihal',
      selector: 'perihal',
      enableHiding: false,
      data: (row: any) => <div>{row.perihal}</div>,
    },
    {
      name: 'PJ',
      selector: 'pj',
      enableHiding: false,
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
      data: (row: any) => <div className='whitespace-nowrap'>{new Date(row.tgl_terbit).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      })}</div>,
    },
    {
      name: '#',
      selector: 'aksi',
      style: ['w-[100px] text-right'],
      data: (row: any) => (
        <Button
          variant="destructive"
          size="icon"
          className="flex items-center gap-2 h-6 w-6"
          onClick={() => {
            onDelete(row)
          }}
        >
          <IconTrash className="h-4 w-4" />
        </Button>
      )
    }
  ]

  return (
    <>
      <div className="mt-4 mb-4 w-full flex flex-col md:flex-row items-center justify-end gap-4 bg-gray-100/50 dark:bg-gray-900/50 border border-border rounded-xl p-4">
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
        lastColumnAction={true}
        onRowClick={onRowClick}
      />
    </>
  )
}

export default TablePPI
