import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Combobox } from '../inputs/combo-box';
import { useState } from 'react';

import LaravelPagingx from '@/components/custom-ui/laravel-paging';

interface PksProps {
  data: any;
  columns: any;
  filterData: any;
  setFilterData: any;
  isValidating: boolean | undefined;
  onRowClick?: (row: any) => void;
  setSelectedItem?: (value: any) => void;
  lastColumnAction?: boolean | undefined;
}

const TabelPKS = ({
  data,
  columns,
  filterData,
  setFilterData,
  isValidating,
  onRowClick = () => {},
  setSelectedItem = () => {},
  lastColumnAction,
}: PksProps) => {
  const [selectedJenis, setSelectedJenis] = useState<string | undefined>(
    undefined
  );
  return (
    <>
      <div className='mb-4 mt-4 flex w-full flex-col items-center justify-end gap-4 rounded-xl border border-border bg-gray-100/50 p-4 dark:bg-gray-900/50 md:flex-row'>
        <div className='w-full space-y-1'>
          <Label htmlFor=''>Jenis PKS</Label>
          <Combobox
            items={[
              { value: '', label: 'Semua Data' },
              { value: 'A', label: 'Internal' },
              { value: 'B', label: 'Eksternal' },
            ]}
            setSelectedItem={(item: any) => {
              setFilterData({ ...filterData, jenis: item });
            }}
            selectedItem={filterData.jenis}
            placeholder='Jenis PKS'
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
    </>
  );
};

export default TabelPKS;
