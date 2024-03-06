import { Combobox } from './combo-box';
import useSWR from 'swr';
import { getSession } from 'next-auth/react';

const SelectPenanggungJawab = ({ ...props }: any) => {
  const fetcher = async (url: string) => {
    const session = await getSession();
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.rsiap?.access_token}`,
      },
    }).then((res) => {
      if (!res.ok) {
        throw Error(res.status + ' ' + res.statusText);
      }
      return res.json();
    });
  };

  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/pegawai?datatables=1&with=bidang_detail&select=nik,nama`,
    fetcher
  );

  if (error) return <div>Error {error.message}</div>;
  if (!data)
    return (
      <div className='h-[2.1rem] w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-900'></div>
    );

  return (
    <Combobox
      items={data.data.map((item: any) => {
        return {
          value: item.nik,
          label: item.nama,
        };
      })}
      {...props}
    />
  );
};

export default SelectPenanggungJawab;
