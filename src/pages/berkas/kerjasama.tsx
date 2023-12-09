import { ReactElement, useEffect, useState } from "react";
import { NextPageWithLayout } from "../_app";

import AppLayout from "@/components/layouts/app";
import FormAddPks from "@/components/custom/forms/add-pks";
import FormEditPks from "@/components/custom/forms/edit-pks";
import LaravelPagination from "@/components/custom/tables/laravel-pagination";

import { getDate, getFullDate } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconEdit, IconFileSearch, IconPlus, IconTrash } from "@tabler/icons-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { IconExclamationCircle } from "@tabler/icons-react";




const BerkasKerjasama: NextPageWithLayout = () => {
  const router = useRouter();

  const [pks, setPks] = useState<any>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isRowClick, setIsRowClick] = useState(false);

  const [lastNomor, setLastNomor] = useState<any>({
    internal: null,
    eksternal: null
  });

  useEffect(() => {
    const fetchLastNomor = async () => {
      const session = await getSession();
      const res = await fetch(`https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/berkas/pks/last-nomor`, {
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
  }, [])


  const onUpdate = async (e: any) => {
    e.preventDefault();

    const session = await getSession();
    const updateData = new FormData(e.target);

    const res = await fetch(`https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/berkas/pks/${pks.id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.rsiap?.access_token}`
      },
      body: updateData
    });

    const result = await res.json();

    if (result.success) {
      toast.success('Data berhasil diperbarui!');
      setIsOpen(false)
      router.reload()
    } else {
      console.log(result);
    }
  }

  const onDelete = async (id: string) => {
    const session = await getSession();
    const res = await fetch(`https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/berkas/pks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session?.rsiap?.access_token}`
      }
    });

    const result = await res.json();
    if (result.success) {
      toast.success('Data berhasil dihapus!');
      await new Promise(r => setTimeout(r, 1000));
      router.reload()
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
      data: (row: any) => <div>{row.judul}</div>
    },
    {
      name: 'No. PKS Eksternal',
      selector: 'no_pks_eksternal',
      style: [
        'text-right'
      ],
      data: (row: any) => row.no_pks_eksternal ? (
        <div className="text-right">
          <Badge variant='outline' className="whitespace-nowrap group-hover:border-primary">{row.no_pks_eksternal}</Badge>
        </div>
      ) : (<></>)
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
  ]

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
                <FormAddPks lastNomor={lastNomor} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <LaravelPagination
            columns={pksColumns}
            onRowClick={(row: any) => {
              setPks(row)
              setIsRowClick(true)
            }}
            dataSrc={"https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/berkas/pks"}
            fetcher={{ method: "GET" }}
          />
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
              <div>{pks.pj_detail?.nama}</div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="default" size="sm" className="flex items-center gap-2" onClick={() => {
              setIsPreview(true)
            }}>
              <IconFileSearch className="h-4 w-4" /> Lihat File
            </Button>

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
      <Dialog open={isPreview} onOpenChange={setIsPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preview Berkas</DialogTitle>
          </DialogHeader>
          <iframe src={"https://sim.rsiaaisyiyah.com/webapps/rsia_pks/" + pks.berkas} className="w-full h-[calc(100vh-110px)]"></iframe>
        </DialogContent>
      </Dialog>


      {/* Dialog Edit PKS */}
      <Dialog open={isModalEditOpen} onOpenChange={setIsModalEditOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Forms Edit PKS</DialogTitle>
            <DialogDescription>
              Anda bisa mengedit data perjanjian kerjasama ini melalui form dibawah ini.
              {/* alert */}
              <div className="px-3 py-2 rounded-xl border-2 border-warning mt-1.5">
                <div className="font-bold flex items-center justify-start text-warning gap-2">
                  <IconExclamationCircle className="h-4 w-4 text-warning" /> Perhatian!
                </div>
                Harap berhati-hati dalam mengedit <span className="font-bold">Nomor Surat</span> agar tidak terjadi duplikasi data.
              </div>
            </DialogDescription>
          </DialogHeader>
          <FormEditPks pks={pks} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

BerkasKerjasama.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default BerkasKerjasama;