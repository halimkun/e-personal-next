import { ReactElement, useEffect, useRef, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import useSWR from "swr";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconArrowLeft, IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { getFullDateWithDayName, getTime } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const AppLayout = dynamic(() => import('@/components/layouts/app'), { ssr: false });
const PenerimaUndanganTable = dynamic(() => import('@/components/custom/tables/penerima-undangan'), { ssr: false });
const TablePegawai = dynamic(() => import('@/components/custom/tables/pegawai'), { ssr: false });
const Loading1 = dynamic(() => import('@/components/custom/icon-loading'), { ssr: false });

const KehadiranKegiatanPage = ({ nomor, kegiatan, penerima }: { nomor: string, kegiatan: any, penerima: any }) => {
  const router = useRouter();

  const [data, setData] = useState(kegiatan.data || []);
  const [isMoreKaryawan, setIsMoreKaryawan] = useState<boolean>(false);

  const [karyawan, setKaryawan] = useState<string[]>([]);
  const [karyawanHadir, setKaryawanHadir] = useState<any[]>([]);

  const delayDebounceFn = useRef<any>(null)
  const [filterData, setFilterData] = useState({})
  const [filterQuery, setFilterQuery] = useState('')

  const fetcher = async (url: string) => {
    const session = await getSession()

    const response = await fetch(url + filterQuery, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.rsiap?.access_token}`,
      },
      body: JSON.stringify({ no_surat: nomor })
    })

    if (!response.ok) {
      throw new Error(response.status + ' ' + response.statusText)
    }

    const jsonData = await response.json()
    return jsonData
  }

  const { data: dataPenerima, error, mutate, isLoading, isValidating } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/undangan/penerima`, fetcher, {
    revalidateOnFocus: false,
    refreshWhenOffline: false,
    refreshWhenHidden: true,
  })

  useEffect(() => {
    let fq = ''
    for (const [key, value] of Object.entries(filterData)) {
      if (value) {
        fq += fq === '' ? `?${key}=${value}` : `&${key}=${value}`
      }
    }

    setFilterQuery(fq)
  }, [filterData])

  useEffect(() => {
    if (delayDebounceFn.current) {
      clearTimeout(delayDebounceFn.current);
    }

    delayDebounceFn.current = setTimeout(() => {
      mutate();
    }, 250);

    return () => clearTimeout(delayDebounceFn.current);
  }, [filterQuery]);


  const onSubmit = async (e: any) => {
    e.preventDefault();
    const session = await getSession();
    const formData = new FormData();

    formData.append('no_surat', nomor);
    formData.append('karyawan', JSON.stringify(karyawan));

    // undangan/kegiatan/tambah/presensi
    toast.promise(
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/undangan/kegiatan/tambah/presensi`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.rsiap?.access_token}`,
        },
        body: formData
      }).catch(err => {
        throw new Error(err)
      }).then(async (res) => {
        await new Promise((resolve) => setTimeout(resolve, 1500)); // <---- fake loading
        if (res?.ok) {
          return res?.status;
        } else {
          throw new Error("Gagal menyimpan data")
        }
      }),
      {
        loading: 'Menyimpan...',
        success: (res) => {
          router.reload();
          return 'Berhasil menyimpan data'
        },
        error: (err) => {
          return err?.message || 'Gagal menyimpan data'
        }
      }
    )
  }

  const KaryawanColumns = [
    {
      name: "",
      selector: 'pilih',
      data: (row: any) => (
        <div className="px-2">
          <Checkbox
            id={row.nik}
            name="karyawan[]"
            value={row.nik}
            checked={karyawan.includes(row.nik)}
            onCheckedChange={() => {
              if (karyawan.includes(row.nik)) {
                setKaryawan(karyawan.filter((item: any) => item !== row.nik))
              } else {
                setKaryawan([...karyawan, row.nik])
              }
            }}
          />
        </div>
      )
    },

    {
      name: 'Nama',
      selector: 'nama',
      data: (row: any) => (
        <div className="flex items-center gap-4">
          <label
            htmlFor={row.nik}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-full"
          >
            <div className="font-bold">{row.nama}</div>
          </label>
        </div>
      )
    },

    {
      name: 'NIK',
      selector: 'nik',
      data: (row: any) => (
        <div className="flex items-center gap-4">
          <label
            htmlFor={row.nik}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-full"
          >
            <Badge variant="secondary" className="cursor-pointer">
              {row.nik}
            </Badge>
          </label>
        </div>
      )
    },

    {
      name: 'Jabatan',
      selector: 'jabatan',
      data: (row: any) => (
        <div className="flex items-center gap-4">
          <label
            htmlFor={row.nik}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-full"
          >
            {row.jbtn}
          </label>
        </div>
      )
    },

    {
      name: 'Bidang',
      selector: 'bidang',
      data: (row: any) => (
        <div className="flex items-center gap-4">
          <label
            htmlFor={row.nik}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-full"
          >
            {row.bidang}
          </label>
        </div>
      )
    },

    {
      name: 'Departemen',
      selector: 'departemen',
      data: (row: any) => (
        <div className="flex items-center gap-4">
          <label
            htmlFor={row.nik}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-full"
          >
            {row.dpt.nama}
          </label>
        </div>
      )
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <CardHeader className="p-3">
          <div className="flex items-center gap-4">
            <Button type="button" variant="outline" size='icon' onClick={() => router.back()}>
              <IconArrowLeft className="rotate-0 scale-100 transition-all" />
            </Button>

            <Separator orientation="vertical" className="h-8 border-primary" />

            <div className="flex flex-col gap-0.5">
              <CardTitle className="text-primary">Kehadiran Karyawan</CardTitle>
              <CardDescription>Data kehadiran karyawan dalam rapat | <strong>RSIA Aisyiyah Pekajangan</strong></CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <form method="post" onSubmit={onSubmit}> {/* <<==== TODO: do submit instruction */}
        <div className="flex flex-col-reverse lg:flex-row items-start gap-3">
          <div className="flex flex-col gap-3 w-full">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Data Penerima Undangan Kegiatan</CardTitle>
                <CardDescription>Berikut ini adalah data penerima undangan kegiatan</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading && <Loading1 height={50} width={50} />}
                {error && <div>{error.message}</div>}
                {dataPenerima && (
                  <PenerimaUndanganTable
                    data={dataPenerima.data ?? []}
                    setKaryawanHadir={setKaryawanHadir}
                    filterData={filterData}
                    setFilterData={setFilterData}
                  />
                )}

                <div className="w-full flex mt-7">
                  <Button type="button" variant="outline" size="sm" onClick={() => {
                    setIsMoreKaryawan(!isMoreKaryawan)
                    if (isMoreKaryawan) {
                      setKaryawan([])
                    }
                  }}>
                    {isMoreKaryawan ? 'Clear Data Tambahan' : 'Tambah Karyawan'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {isMoreKaryawan && (
              <Card className="w-full fade-in fade-out transition-all duration-300">
                <CardHeader>
                  <CardTitle>Data Karyawan</CardTitle>
                  <CardDescription>Anda dapat menambahkan karyawan selain penerima undangan untuk kehadiran, <span className="text-warning">semua data yang terpilih pada tabel dibawah ini akan dianggap hadir</span></CardDescription>
                </CardHeader>
                <CardContent>
                  <TablePegawai
                    columnsData={KaryawanColumns}
                  />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="p-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-primary flex gap-5">Kehadiran Karyawan</CardTitle>
                  <Button type="submit">Simpan</Button>
                </div>
              </CardHeader>
            </Card>
          </div>

          <Card className="w-full lg:w-[55%] bg-secondary lg:sticky top-[67px]">
            <CardHeader>
              <CardTitle>Informasi Kegiatan</CardTitle>
              <CardDescription>Berikut ini adalah informasi kegiatannya</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1.5">
                <div className="space-y-1">
                  <p className="text-primary font-bold">No. Surat</p>
                  {nomor}
                </div>
                <div className="space-y-1">
                  <p className="text-primary font-bold">Perihal</p>
                  {data.perihal}
                </div>
                <div className="space-y-1">
                  <p className="text-primary font-bold">Tempat</p>
                  {data.tempat}
                </div>
                <div className="space-y-1">
                  <p className="text-primary font-bold">Penanggung Jawab</p>
                  {data.penanggung_jawab.nama}
                </div>
                <div className="space-y-1">
                  <p className="text-primary font-bold">Tanggal & Waktu</p>
                  {getFullDateWithDayName(data.tanggal)} | {getTime(data.tanggal)} WIB
                </div>
                <div className="space-y-1">
                  <p className="text-primary font-bold">Jumlah Peserta</p>
                  {data.penerima_count} orang ( {karyawanHadir.length} hadir )
                </div>
                <div className="space-y-1">
                  <p className="text-primary font-bold">Notulen</p>
                  <Badge variant={data.notulen ? 'success' : 'danger'}>{data.notulen ? (
                    <><IconCircleCheck size={18} className="mr-1" /> sudah dibuat</>
                  ) : (
                    <><IconCircleX size={18} className="mr-1" /> belum dibuat</>
                  )}</Badge>

                  {data.notulen && (
                    <div className="py-4">
                      <table className="w-full">
                        <tr className="border-b border-foreground/12">
                          <th className="text-left">Oleh</th>
                          <td>{data.notulen.notulis.nama}</td>
                        </tr>
                        <tr className="border-b border-foreground/12">
                          <th className="text-left">Pada</th>
                          <td>{getFullDateWithDayName(data.notulen.created_at)}</td>
                        </tr>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { nomor } = context.params;
  const nomorSurat = nomor.replaceAll('--', '/');

  const session = await getSession(context);

  const kegiatan = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/undangan/detail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.rsiap?.access_token}`
    },
    body: JSON.stringify({ no_surat: nomorSurat })
  }).then(res => res.json());

  const penerima = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/undangan/penerima`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.rsiap?.access_token}`
    },
    body: JSON.stringify({ no_surat: nomorSurat })
  }).then(res => res.json());

  if (kegiatan.success === false) {
    return {
      redirect: {
        destination: context.req.headers.referer || '/berkas/notulen',
        permanent: false,
      },
    }
  }

  return {
    props: {
      nomor: nomorSurat,
      kegiatan: kegiatan,
    },
  }

}

KehadiranKegiatanPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default KehadiranKegiatanPage;