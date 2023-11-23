import { TableKaryawanDemo } from '@/components/custom/tables/karyawan-demo';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


export type Karyawan = {
  nik: string
  nama: string
  bidang: string
  jbtn: string
  departemen: string
  dpt: object
}

const columns: ColumnDef<Karyawan>[] = [
  {
    accessorKey: "nama",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nama")}</div>
    ),
  },
  {
    accessorKey: "NIK",
    header: "NIK",
    cell: ({ row }) => {
      const data = row.original;
      return <div className="uppercase">{data.nik}</div>
    },
  },
  {
    accessorKey: "bidang",
    header: "Bidang",
    cell: ({ row }) => <div className="uppercase">{row.getValue("bidang")}</div>,
  },
  {
    accessorKey: "jabatan",
    header: "Jabatan",
    cell: ({ row }) => {
      const data = row.original
      return <div className="font-medium">{data.jbtn}</div>
    },
  },
  {
    accessorKey: "departemen",
    header: "Departemen",
    cell: ({ row }) => {
      const data = row.original
      return <div className="font-medium">{(data.dpt as any).nama}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const data = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(data.nik)}
            >
              Copy payment ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const InitTableKaryawan = ({ karyawan, options, setPage, setKeyword }: any) => {
  return <TableKaryawanDemo columns={columns} data={karyawan} options={options} setPage={setPage} setKeyword={setKeyword} />
}

export default InitTableKaryawan