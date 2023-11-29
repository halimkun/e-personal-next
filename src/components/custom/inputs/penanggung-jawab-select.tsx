import { useState } from "react";
import { Combobox } from "./combo-box";
import { getCookie } from "cookies-next";
import useSWR from "swr";

const SelectPenanggungJawab = ({ ...props }: any) => {
  const fetcher = (url: string) => fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getCookie('access_token')}`,
    },
  }).then(res => {
    if (!res.ok) {
      throw Error(res.status + ' ' + res.statusText)
    }
    return res.json()
  });

  const { data, error } = useSWR(`https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/pegawai?datatables=1&with=bidang_detail&select=nik,nama`, fetcher);

  if (error) return <div>Error {error.message}</div>
  if (!data) return (
    <div className="w-full h-[2.1rem] rounded-md bg-gray-200 dark:bg-gray-900 animate-pulse"></div>
  )

  return (
    <Combobox items={data.data.map((item: any) => {
      return {
        value: item.nik,
        label: item.nama
      }
    })} {...props} />
  )

};

export default SelectPenanggungJawab;