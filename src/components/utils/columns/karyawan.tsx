import { Badge } from '@/components/ui/badge';

interface KaryawanColumnsProps {
  action?: {
    name: string;
    selector: string;
    data: (row: any) => JSX.Element;
  };
}

export const KaryawanColumns = (props: KaryawanColumnsProps) => [
  {
    name: 'Nama',
    selector: 'nama',
    data: (row: any) => (
      <div className='flex items-center gap-4'>
        <label
          htmlFor={row.nik}
          className='w-full text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          <div className='font-bold'>{row.nama}</div>
        </label>
      </div>
    ),
  },

  {
    name: 'NIK',
    selector: 'nik',
    data: (row: any) => (
      <div className='flex items-center gap-4'>
        <label
          htmlFor={row.nik}
          className='w-full text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          <Badge variant='secondary' className='cursor-pointer'>
            {row.nik}
          </Badge>
        </label>
      </div>
    ),
  },

  {
    name: 'Jabatan',
    selector: 'jabatan',
    data: (row: any) => (
      <div className='flex items-center gap-4'>
        <label
          htmlFor={row.nik}
          className='w-full text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          {row.jbtn}
        </label>
      </div>
    ),
  },

  {
    name: 'Bidang',
    selector: 'bidang',
    data: (row: any) => (
      <div className='flex items-center gap-4'>
        <label
          htmlFor={row.nik}
          className='w-full text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          {row.bidang}
        </label>
      </div>
    ),
  },

  {
    name: 'Departemen',
    selector: 'departemen',
    data: (row: any) => (
      <div className='flex items-center gap-4'>
        <label
          htmlFor={row.nik}
          className='w-full text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          {row.dpt.nama}
        </label>
      </div>
    ),
  },

  props.action && {
    name: 'Action',
    selector: 'action',
    data: props.action.data,
  },
];
