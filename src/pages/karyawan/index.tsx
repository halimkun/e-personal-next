import React, { ReactElement, useEffect, useState } from 'react';
import { NextPageWithLayout } from '../_app';
import AppLayout from '@/components/layouts/app';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import InitTableKaryawan from './_init-table';
import { getCookie } from 'cookies-next';

const KaryawanPage: NextPageWithLayout = () => {
  const [dataKaryawan, setDataKaryawan] = useState([])
  const [dataOptions, setDataOptions] = useState([])
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/pegawai?datatables=0&select=nik,nama,bidang,jbtn&page=" + page + "&keyword=" + keyword, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getCookie('access_token')}`,
        },
      }).then((res) => res.json())
        .then((data) => {
          setDataKaryawan(data.data.data);
          delete data.data.data;
          setDataOptions(data.data);
        }).catch((err) => {
          console.log(err);
        });
    }

    fetchData();

    console.log(page);
  }, [page, keyword]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Karyawan</CardTitle>
        <CardDescription>Data Karyawan <strong>RSIA Aisyiyah Pekajangan</strong></CardDescription>
      </CardHeader>
      <CardContent>
        <InitTableKaryawan karyawan={dataKaryawan} options={dataOptions} setPage={setPage} setKeyword={setKeyword} />
      </CardContent>
    </Card>
  );
};

KaryawanPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default KaryawanPage;
