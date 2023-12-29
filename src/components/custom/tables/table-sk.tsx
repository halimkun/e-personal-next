import React, { useEffect } from 'react'
import useSWR from 'swr'
import Loading1 from '../icon-loading'
import { getSession } from 'next-auth/react'
import LaravelPagingx from '@/components/custom-ui/laravel-paging'
import { Badge } from '@/components/ui/badge'

interface tableProps {
  data: any
  filterData: any
  setFilterData: any
}

const TableSk = ({ data, filterData, setFilterData }: tableProps) => {
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
      data: (row: any) => <div>{<Badge variant="outline">{row.pj}</Badge>}</div>,
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

  return (<LaravelPagingx data={data.data} columnsData={columns} filterData={filterData} setFilterData={setFilterData} />)
}

export default TableSk
