import { ReactElement, useState } from "react";
import { NextPageWithLayout } from "../_app";

import AppLayout from "@/components/layouts/app";
import LaravelPagination from "@/components/custom/tables/laravel-pagination";

import { getDate } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconDotsVertical, IconEdit, IconInnerShadowTop, IconPlus, IconTrash } from "@tabler/icons-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/custom/inputs/combo-box";
import { getSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";


const BerkasKerjasama: NextPageWithLayout = () => {
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true)

    const session = await getSession();
    const data = new FormData(e.target);

    const res = await fetch(`https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/berkas/pks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.rsiap?.access_token}`
      },
      body: data
    });

    const result = await res.json();
    if (result.success) {
      toast({
        title: "Berhasil",
        description: "Berkas berhasil ditambahkan",
      })
      setIsOpen(false)
      router.reload()
      setIsLoading(false)
    } else {
      console.log(result);
      setIsLoading(false)
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
    {
      name: '',
      selector: 'action',
      style: [
        'text-right'
      ],
      data: (row: any) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0" size='icon'>
              <span className="sr-only">Open menu</span>
              <IconDotsVertical className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Menu Berkas Perjanjian</DialogTitle>
              <DialogDescription>
                Anda bisa mengelola berkas perjanjian kerjasama ini melalui menu dibawah ini.
              </DialogDescription>
            </DialogHeader>
            {/* dialog content */}

          </DialogContent>
        </Dialog>
      )
    }
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
                <Button variant="default" size="icon" className="w-7 h-7">
                  <span className="sr-only">Open menu</span>
                  <IconPlus className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Entri Data Perjanjian Kerjasama</DialogTitle>
                  <DialogDescription>Tambahkan data perjanjian kerjasama baru dengan mengisi form dibawah ini.</DialogDescription>
                </DialogHeader>
                {/* dialog content */}
                <form method="post" encType="multipart/form-data" onSubmit={onSubmit}>
                  <div className="mb-4 space-y-1.5">
                    <Label htmlFor="judul">Judul</Label>
                    <Input type="text" id="judul" name="judul" placeholder="Judul / Nama berkas" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="mb-4 space-y-1.5">
                      <Label htmlFor="no_pks_internal">No. PKS Internal</Label>
                      <Input type="text" id="no_pks_internal" name="no_pks_internal" placeholder="No. PKS Internal" />
                    </div>
                    <div className="mb-4 space-y-1.5">
                      <Label htmlFor="no_pks_eksternal">No. PKS Eksternal</Label>
                      <Input type="text" id="no_pks_eksternal" name="no_pks_eksternal" placeholder="No. PKS Eksternal" />
                    </div>
                    {/* tanggal awal dan akhir */}
                    <div className="mb-4 space-y-1.5">
                      <Label htmlFor="tanggal_awal">Tanggal Awal</Label>
                      <Input type="date" id="tanggal_awal" name="tanggal_awal" placeholder="Tanggal Awal" />
                    </div>
                    <div className="mb-4 space-y-1.5">
                      <Label htmlFor="tanggal_akhir">Tanggal Ahir</Label>
                      <Input type="date" id="tanggal_akhir" name="tanggal_akhir" placeholder="Tanggal Ahir" />
                    </div>
                  </div>
                  <div className="mb-4 space-y-1.5">
                    <Label htmlFor="pj">Penanggung Jawab</Label>
                    <Input type="hidden" id="pj" name="pj" value={selected} />
                    <Combobox items={[
                      { label: "Kicky Eka Shelviani, M.S.M", value: "3.925.0123" },
                      { label: "Nuranisa Heristiani, Amd.Keb", value: "2.318.0217" },
                      { label: "Satya Putranto, S.E", value: "3.903.0916" },
                      { label: "Immawan Hudayanto, ST", value: "3.901.1209" },
                    ]} setSelectedItem={setSelected} selectedItem={selected} placeholder="Pilih Penanggung Jawab" />
                  </div>
                  <div className="mb-4 space-y-1.5">
                    <Label htmlFor="file">File</Label>
                    <Input type="file" id="file" name="file" placeholder="File" />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="submit" variant="default">
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2 w-full">
                          <IconInnerShadowTop className="h-4 w-4 animate-spin" /> Uploading . . .
                        </span>
                      ) : 'Simpan'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <LaravelPagination
            columns={pksColumns}
            dataSrc={"https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/berkas/pks"}
            fetcher={{ method: "GET" }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

BerkasKerjasama.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default BerkasKerjasama;