import { ReactElement, useEffect, useState } from "react";
import { NextPageWithLayout } from "../_app";

import AppLayout from "@/components/layouts/app";
import LaravelPagination from "@/components/custom/tables/laravel-pagination";

import { getDate, getFullDate } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconDotsVertical, IconEdit, IconFileSearch, IconInnerShadowTop, IconPlus, IconSettings2, IconTrash } from "@tabler/icons-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/custom/inputs/combo-box";
import { getSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"



const BerkasKerjasama: NextPageWithLayout = () => {
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const [isRowClick, setIsRowClick] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [pks, setPks] = useState<any>([]);

  const router = useRouter();

  const [lastNomor, setLastNomor] = useState<any>({
    internal: null,
    eksternal: null
  });

  const [selectedType, setSelectedType] = useState<'internal' | 'eksternal'>('internal');
  const [tanggal, setTanggal] = useState<string | undefined>(new Date().toISOString().slice(0, 10));
  const [noPksInternal, setNoPksInternal] = useState<string | undefined>('');
  
  useEffect(() => {
    if (lastNomor['internal'] && lastNomor['eksternal']) {
      parseNomorSurat()
    }
  }, [lastNomor, selectedType, tanggal])
  
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
  
  const parseNomorSurat = () => {
    // Nomor Surat
    const split = lastNomor[selectedType].split('/');
    const n = parseInt(split[0]) + (isEdit ? 0 : 1);
    console.log(n);
    const nn = n < 100 ? `0${n}` : n;

    // type surat
    const t = selectedType == 'internal' ? 'A' : 'B';

    // Tanggala
    const tanggalSplit = tanggal?.split('-');
    const tanggalParsed = tanggalSplit?.map((item, index) => { index == 0 ? item = item.slice(2) : item = item; return item }).reverse().join('');

    // Merge All
    const nomorSurat = `${nn}/${t}/PKS-RSIA/${tanggalParsed}`;
    setNoPksInternal(nomorSurat);
  }


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
      toast.success('Data berhasil disimpan!');
      setIsOpen(false)
      router.reload()
      setIsLoading(false)
    } else {
      console.log(result);
      setIsLoading(false)
    }
  }

  const onUpload = async (e: any) => {
    e.preventDefault();
    setIsLoading(true)

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
      setIsLoading(false)
    } else {
      console.log(result);
      setIsLoading(false)
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
                  parseNomorSurat()
                  setIsEdit(false)
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
                <form method="post" encType="multipart/form-data" onSubmit={isEdit ? onUpload : onSubmit}>
                  {isEdit ? (<div className="mb-4 space-y-1.5">
                    <Label className="text-primary font-semibold" htmlFor="id">Id Berkas</Label>
                    <Input type="text" id="id" name="id" placeholder="id berkas" defaultValue={isEdit ? pks.id : ''} readOnly={true} />
                  </div>) : (<></>)}
                  <div className="mb-4 space-y-1.5">
                    <Label className="text-primary font-semibold" htmlFor="judul">Judul</Label>
                    <Input type="text" id="judul" name="judul" placeholder="Judul / Nama berkas" defaultValue={isEdit ? pks.judul : ''} />
                  </div>

                  <div className="mb-4 space-y-1.5 relative">
                    <Label className="text-primary font-semibold" htmlFor="tipe-surat">Tipe Surat</Label>
                    <RadioGroup className="flex gap-6" onValueChange={setSelectedType as any} defaultValue="internal">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="internal" id="r1" />
                        <Label className="font-medium" htmlFor="r1">Internal Rumah Sakit</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="eksternal" id="r2" />
                        <Label className="font-medium" htmlFor="r2">Antar Instansi</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-2 gap-3 gap-y-1">
                    {/* tanggal awal dan akhir */}
                    <div className="mb-4 space-y-1.5">
                      <Label className="text-primary font-semibold" htmlFor="tanggal_awal">Tanggal Awal</Label>
                      {/* get date now yyyy-MM-dd */}
                      <Input type="date" id="tanggal_awal" name="tanggal_awal" placeholder="Tanggal Awal" defaultValue={isEdit ? pks.tanggal_awal : new Date().toISOString().slice(0, 10)} onChange={(e) => {
                        setTanggal(e.currentTarget.value)
                      }} />
                    </div>
                    <div className="mb-4 space-y-1.5">
                      <Label className="text-primary font-semibold" htmlFor="tanggal_akhir">Tanggal Ahir</Label>
                      <Input type="date" id="tanggal_akhir" name="tanggal_akhir" placeholder="Tanggal Ahir" defaultValue={isEdit ? pks.tanggal_akhir : ''} />
                    </div>
                    {/* No Pks Intenal Dan Eksternal */}
                    <div className="mb-4 space-y-1.5">
                      <Label className="text-primary font-semibold" htmlFor="no_pks_internal">No. PKS Internal</Label>
                      <Input type="text" id="no_pks_internal" name="no_pks_internal" placeholder="No. PKS Internal" value={noPksInternal} readOnly onChange={(e) => {
                        setNoPksInternal(e.currentTarget.value)
                      }} />
                    </div>
                    <div className="mb-4 space-y-1.5">
                      <Label className="text-primary font-semibold" htmlFor="no_pks_eksternal">No. PKS Eksternal</Label>
                      <Input type="text" id="no_pks_eksternal" name="no_pks_eksternal" placeholder="No. PKS Eksternal" defaultValue={isEdit ? pks.no_pks_eksternal : ''} />
                    </div>
                  </div>
                  <div className="mb-4 space-y-1.5">
                    <Label className="text-primary font-semibold" htmlFor="pj">Penanggung Jawab</Label>
                    <Input type="hidden" id="pj" name="pj" defaultValue={selected} />
                    <Combobox items={[
                      { label: "Kicky Eka Shelviani, M.S.M", value: "3.925.0123" },
                      { label: "Nuranisa Heristiani, Amd.Keb", value: "2.318.0217" },
                      { label: "Satya Putranto, S.E", value: "3.903.0916" },
                      { label: "Immawan Hudayanto, ST", value: "3.901.1209" },
                    ]} setSelectedItem={setSelected} selectedItem={selected} placeholder="Pilih Penanggung Jawab" />
                  </div>
                  {!isEdit ? (
                    <div className="mb-4 space-y-1.5">
                      <Label className="text-primary font-semibold" htmlFor="file">File</Label>
                      <Input type="file" id="file" name="file" placeholder="File" />
                    </div>
                  ) : (<div className="mb-4"></div>)}

                  <div className="flex justify-end gap-2">
                    <Button type="submit" variant="default">
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2 w-full">
                          <IconInnerShadowTop className="h-4 w-4 animate-spin" /> {isEdit ? 'Memperbarui data...' : 'Uploading...'}
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
            onRowClick={(row: any) => {
              setPks(row)
              setNoPksInternal(row.no_pks_internal)
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
            {/* on click open new window "https://sim.rsiaaisyiyah.com/webapps/rsia_pks/" + pks.berkas */}
            <Button variant="default" size="sm" className="flex items-center gap-2" onClick={() => {
              setIsPreview(true)
            }}>
              <IconFileSearch className="h-4 w-4" /> Lihat File
            </Button>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => {
                setIsEdit(true)
                setIsOpen(true)
                setIsRowClick(false)
                setSelected(pks.pj)
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
    </div>
  );
}

BerkasKerjasama.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default BerkasKerjasama;