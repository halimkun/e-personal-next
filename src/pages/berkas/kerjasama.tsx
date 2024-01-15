import { NextPageWithLayout } from "../_app";
import { ReactElement, useEffect, useRef, useState } from "react";

import useSWR from "swr";
import AppLayout from "@/components/layouts/app";
import TabelPKS from "@/components/custom/tables/pks";
import Loading1 from "@/components/custom/icon-loading";
import FormAddPks from "@/components/custom/forms/add-pks";
import DialogEditPks from "@/components/custom/modals/dialog-edit-pks";
import DialogPreviewBerkas from "@/components/custom/modals/dialog-preview-berkas";

import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDate, getFullDate } from "@/lib/date";
import { IconEdit, IconFileOff, IconFileSearch, IconPlus, IconTrash } from "@tabler/icons-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"


const BerkasKerjasama: NextPageWithLayout = () => {
  const router = useRouter();

  const [pks, setPks] = useState<any>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [tanggalAwal, setTanggalAwal] = useState<string>(new Date().toISOString().slice(0, 10));
  const [isRowClick, setIsRowClick] = useState(false);

  const delayDebounceFn = useRef<any>(null)
  const [filterData, setFilterData] = useState({})
  const [filterQuery, setFilterQuery] = useState('')

  const [lastNomor, setLastNomor] = useState<any>({
    internal: null,
    eksternal: null
  });

  const fetcher = async (url: any) => {
    const session = await getSession()
    const response = await fetch(url + filterQuery, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.rsiap?.access_token}`,
      },
    })

    if (!response.ok) {
      throw new Error(response.status + ' ' + response.statusText)
    }

    const jsonData = await response.json()
    return jsonData
  }

  const { data, error, mutate, isLoading, isValidating } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/berkas/pks`, fetcher, {
    revalidateOnFocus: false,
    refreshWhenOffline: false,
    refreshWhenHidden: true,
  })

  useEffect(() => {
    const fetchLastNomor = async () => {
      const session = await getSession();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/berkas/pks/last-nomor?tanggal_awal=${tanggalAwal}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session?.rsiap?.access_token}`
        }
      });
      const result = await res.json();
      if (result.success) {
        setLastNomor(result.data)
      } else {
        console.log(result);
      }
    }

    fetchLastNomor()
  }, [tanggalAwal])

  const onDelete = async (id: string) => {
    const session = await getSession();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/berkas/pks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session?.rsiap?.access_token}`
      }
    });

    const result = await res.json();
    if (result.success) {
      toast.success('Data berhasil dihapus!');
      await new Promise(r => setTimeout(r, 1000));
      mutate();
    } else {
      console.log(result);
    }
  }

  const pksColumns = [
    {
      name: 'No. PKS Internal',
      selector: 'no_pks_internal',
      data: (row: any) => row.no_pks_internal ? (<Badge variant='outline' className="whitespace-nowrap group-hover:border-primary">{row.no_pks_internal}</Badge>) : (<></>)
    },
    {
      name: 'Judul / Nama PKS',
      selector: 'judul_or_nama',
      data: (row: any) => (
        <>
          <div className="flex gap-3 items-center">
            {row.judul} {row.berkas == '' && (<div className="p-1 bg-red-300 rounded-full"><IconFileOff className="h-4 w-4 stroke-red-500" /></div>)}
          </div>
          {row.no_pks_eksternal && (
            <div className="text-left mt-1">
              <Badge variant='outline' className="whitespace-nowrap group-hover:border-primary">{row.no_pks_eksternal}</Badge>
            </div>
          )}
        </>
      )
    },
    {
      name: 'Tanggal',
      selector: 'tanggal_and_ahir',
      // row,tanggal_akir == 0000-00-00
      data: (row: any) => (
        <pre className="lowercase">
          <div className="text-sm">Awal : {getDate(row.tanggal_awal)}</div>
          <div className="text-sm">Ahir : {row.tanggal_akhir == '0000-00-00' ? '-' : getDate(row.tanggal_akhir)}</div>
        </pre>
      )
    },
    {
      name: 'PJ',
      selector: 'pj',
      data: (row: any) => row.pj_detail ? (
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant={"outline"} className="group-hover:border-primary">{row.pj}</Badge>
            </TooltipTrigger>
            <TooltipContent>{row.pj_detail.nama}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (<></>)
    },
    {
      name: '#',
      selector: 'action',
      data: (row: any) => (
        <Button variant="default" size="icon" className="flex items-center gap-2 h-7 w-7" disabled={!row.berkas || row.berkas == '' || row.berkas == null || row.berkas == undefined} onClick={() => {
          setPks(row)
          setIsPreview(true)
        }}>
          <IconFileSearch className="h-4 w-4" />
        </Button>
      )
    }
  ]

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

  if (isLoading) return <Loading1 height={50} width={50} />
  if (error) return <div>{error.message}</div>
  if (!data) return <div>No data</div>

  return (
    <div className="space-y-4">
      <Card className="max-w-screen">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <CardTitle>Berkas Perjanjian</CardTitle>
              <CardDescription>Daftar Berkas Perjanjian Kerjasama</CardDescription>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="icon" className="w-7 h-7" onClick={() => {
                  setPks([])
                  setIsOpen(true)
                }}>
                  <span className="sr-only">Open menu</span>
                  <IconPlus className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle className="text-primary">Entri Data Perjanjian Kerjasama</DialogTitle>
                  <DialogDescription>Tambahkan data perjanjian kerjasama baru dengan mengisi form dibawah ini.</DialogDescription>
                </DialogHeader>
                {/* dialog content */}
                <FormAddPks
                  lastNomor={lastNomor}
                  tglAwal={tanggalAwal}
                  setTglAwal={setTanggalAwal}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <TabelPKS
            data={data}
            columns={pksColumns}
            filterData={filterData}
            setFilterData={setFilterData}
            isValidating={isValidating}
            lastColumnAction={true}
            onRowClick={(item: any) => {
              setPks(item)
              setIsRowClick(true)
            }}
          />

          {/* <LaravelPagination
            columns={pksColumns}
            onRowClick={(row: any) => {
              setPks(row)
              setIsRowClick(true)
            }}
            dataSrc={`${process.env.NEXT_PUBLIC_API_URL}/berkas/pks`}
            fetcher={{ method: "GET" }}
          /> */}
        </CardContent>
      </Card>


      {/* Dialog on Row Click */}
      <Dialog open={isRowClick} onOpenChange={setIsRowClick}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Menu Berkas Perjanjian</DialogTitle>
            <DialogDescription>
              Anda bisa mengelola berkas perjanjian kerjasama ini melalui menu dibawah ini.
            </DialogDescription>
          </DialogHeader>

          {/* detail */}
          <div className="mb-4 space-y-2">
            <div className="space-y-1">
              <div className="font-bold text-primary text-xs">Judul : </div>
              <div>{pks.judul}</div>
            </div>
            <div className="grid gap-2 grid-cols-2">
              <div className="space-y-1">
                <div className="font-bold text-primary text-xs">No. PKS Internal : </div>
                <Badge variant='secondary'>{pks.no_pks_internal}</Badge>
              </div>
              <div className="space-y-1">
                <div className="font-bold text-primary text-xs">No. PKS Eksternal : </div>
                <Badge variant='secondary'>{pks.no_pks_eksternal ?? "-"}</Badge>
              </div>
              <div className="space-y-1">
                <div className="font-bold text-primary text-xs">Tanggal Awal : </div>
                <div className="cursor-help">{getFullDate(pks.tanggal_awal)}</div>
              </div>
              <div className="space-y-1">
                <div className="font-bold text-primary text-xs">Tanggal Ahir : </div>
                <div className="cursor-help">{pks.tanggal_akhir == '0000-00-00' ? '-' : getFullDate(pks.tanggal_akhir)}</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-bold text-primary text-xs">Penanggung Jawab : </div>
              <div>{pks.pj_detail ? pks.pj_detail.nama : pks.pj}</div>
            </div>
          </div>

          <div className="flex justify-between">
            <div></div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => {
                setIsRowClick(false)
                setIsModalEditOpen(true)
              }}>
                <IconEdit className="h-4 w-4" /> Edit
              </Button>
              <Button variant="destructive" size="sm" className="flex items-center gap-2" onClick={() => {
                window.confirm('Apakah anda yakin ingin menghapus data ini?') && onDelete(pks.id)
              }}>
                <IconTrash className="h-4 w-4" /> Hapus
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Preview Berkas */}
      <DialogPreviewBerkas
        berkasUrl={`${process.env.NEXT_PUBLIC_BASE_BERKAS_URL}/rsia_pks/${pks.berkas}`}
        setIsPreview={setIsPreview}
        isPreview={isPreview}
      />

      {/* Dialog Edit PKS */}
      <DialogEditPks
        isModalEditOpen={isModalEditOpen}
        setIsModalEditOpen={setIsModalEditOpen}
        pks={pks}
      />
    </div>
  );
}

BerkasKerjasama.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default BerkasKerjasama;