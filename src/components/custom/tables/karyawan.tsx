import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IconSettings } from '@tabler/icons-react'

interface karyawanDataType {
  karyawan: any[];
}

const Tablekaryawan = ({ karyawan }: karyawanDataType) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead className="w-[100px]">NIK</TableHead>
          <TableHead>Unit Kerja</TableHead>
          <TableHead>Bidang</TableHead>
          <TableHead className="flex justify-end">
            <IconSettings />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {karyawan.map((d: any) => (
          <TableRow key={d.id}>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">1.00</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

  )
}

export default Tablekaryawan