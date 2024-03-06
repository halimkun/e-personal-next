import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Combobox } from '../inputs/combo-box';
import { ColumnsSuratMasuk } from '@/components/utils/columns/surat-masuk';
import {
  IconBrandWhatsapp,
  IconFile,
  IconFileText,
  IconMail,
  IconPrinter,
} from '@tabler/icons-react';

import dynamic from 'next/dynamic';

const LaravelPagingx = dynamic(
  () => import('@/components/custom-ui/laravel-paging'),
  { ssr: false }
);

interface tableSuratMasukProps {
  data: any;
  filterData: any;
  setFilterData: any;
  isValidating?: boolean | undefined;
  setIsOpenPreview?: (value: boolean) => void;
  setSelectedItem?: (value: any) => void;
  onRowClick?: (row: any) => void;
  lastColumnAction?: boolean | undefined;
}

function getIconFromKetSurat(ket_surat: string) {
  switch (ket_surat) {
    case 'wa':
    case 'whatsapp':
      return (
        <IconBrandWhatsapp className='h-5 w-5 stroke-green-500 dark:stroke-green-500' />
      );
    case 'fisik':
      return (
        <IconFileText className='h-5 w-5 stroke-yellow-500 dark:stroke-yellow-500' />
      );
    case 'email':
      return (
        <IconMail className='h-5 w-5 stroke-red-500 dark:stroke-red-500' />
      );
    case 'fax':
      return (
        <IconPrinter className='h-5 w-5 stroke-blue-500 dark:stroke-blue-500' />
      );
    case 'surat':
      return (
        <IconFileText className='h-5 w-5 stroke-yellow-500 dark:stroke-yellow-500' />
      );
    default:
      return (
        <IconFile className='h-5 w-5 stroke-gray-500 dark:stroke-gray-500' />
      );
  }
}

const TableSuratMasuk = ({
  data,
  filterData,
  setFilterData,
  isValidating,
  setIsOpenPreview = () => {},
  setSelectedItem = () => {},
  onRowClick = () => {},
  lastColumnAction,
}: tableSuratMasukProps) => {
  const columns = ColumnsSuratMasuk({
    setIsOpenPreview,
    setSelectedItem,
    getIconFromKetSurat,
  });
  return (
    <>
      <div className='mb-4 mt-4 flex w-full flex-col items-center justify-end gap-4 rounded-xl border border-border bg-gray-100/50 p-4 dark:bg-gray-900/50 md:flex-row'>
        <div className='w-full space-y-1'>
          <Label>Dikirim Via</Label>
          <Combobox
            items={[
              { value: '', label: 'Semua' },
              { value: 'wa', label: 'WhatsApp' },
              { value: 'fisik', label: 'Fisik' },
              { value: 'email', label: 'Email' },
              { value: 'fax', label: 'FAX' },
            ]}
            setSelectedItem={(item: any) => {
              setFilterData({ ...filterData, via: item });
            }}
            selectedItem={filterData?.jenis}
            placeholder='Dikirim Via'
          />
        </div>
        <div className='w-full space-y-1'>
          <Label>No. SIMRS</Label>
          <Input
            type='date'
            className='w-full'
            name='no_simrs'
            onChange={(e) => {
              setFilterData({ ...filterData, no_simrs: e.target.value });
            }}
          />
        </div>
        <div className='w-full space-y-1'>
          <Label>Tanggal Surat</Label>
          <Input
            type='date'
            className='w-full'
            name='tgl_surat'
            onChange={(e) => {
              setFilterData({ ...filterData, tgl_surat: e.target.value });
            }}
          />
        </div>
        <div className='w-full space-y-1'>
          <Label>Search</Label>
          <Input
            type='search'
            placeholder='Search...'
            className='w-full'
            defaultValue={filterData?.keyword}
            onChange={(e) => {
              setFilterData({ ...filterData, keyword: e.target.value });
            }}
          />
        </div>
      </div>

      {data && (
        <LaravelPagingx
          data={data.data}
          columnsData={columns}
          filterData={filterData}
          setFilterData={setFilterData}
          isValidating={isValidating}
          onRowClick={(item: any) => {
            setSelectedItem(item);
            onRowClick(item);
          }}
          lastColumnAction={lastColumnAction}
        />
      )}
    </>
  );
};

export default TableSuratMasuk;
