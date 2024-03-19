import React, { useEffect, useState } from 'react';
import { Combobox1 } from '../custom/inputs/combobox';
import { Input } from './input';

interface MonthPickerProps {
  setFilterData: (data: any) => void;
}

const MonthPicker = (props: MonthPickerProps) => {
  const { setFilterData } = props;
  const [month, setMonth] = useState<string>('');
  
  useEffect(() => {
    if (month) {
      setFilterData({ ...setFilterData, month });
    }
  }, [month]);

  return (
    <Input type='month' placeholder='Month' onChange={(e) => {
      setMonth(e.target.value);
    }} />
  );
};

export default MonthPicker;