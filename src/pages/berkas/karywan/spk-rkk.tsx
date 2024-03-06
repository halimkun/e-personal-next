import dynamic from "next/dynamic"
import fetcherGet from "@/utils/fetcherGet";
import useSWR from "swr";

import { KaryawanColumns } from "@/components/utils/columns/karyawan"
import { Button } from "@/components/ui/button";
import { IconUpload } from "@tabler/icons-react";
import { IconExternalLink } from "@tabler/icons-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react";
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton";
import { getSession } from "next-auth/react";
import toast from "react-hot-toast";


const AppLayout = dynamic(() => import('@/components/layouts/app'), { ssr: false });
const TablePegawai = dynamic(() => import('@/components/custom/tables/pegawai'), { ssr: false });

const berkasSPKRKK = () => {
  const [karyawan, setKaryawan] = useState<any>()
  const [open, setOpen] = useState(false)

  const fetcher = (url: string) => fetcherGet({ url })
  const { data: kategori, error: kategoriError, isLoading: kategoriLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/pegawai/berkas/kategori?spk_rkk=1`, fetcher)

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const form = e.target
    const formData = new FormData(form)
    formData.append('nik', karyawan.nik)

    const session = await getSession()

    toast.promise(fetch(`${process.env.NEXT_PUBLIC_API_URL}/pegawai/upload/berkas`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.rsiap?.access_token}`
      },
      body: formData
    }).catch((err) => {
      throw new Error(err)
    }).then(async (res) => {
      if (res.ok) {
        return res.status
      } else {
        throw new Error('Gagal mengunggah berkas')
      }
    }),
      {
        loading: 'Mengunggah berkas...',
        success: (res) => {
          setOpen(false)
          window.location.reload()
          return 'Berkas berhasil diunggah'
        },
        error: 'Gagal mengunggah berkas'
      }
    )
  }

  const column = KaryawanColumns({
    action: {
      name: 'Aksi',
      selector: 'aksi',
      data: (row: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant={row.spkrkk.length ? 'secondary' : 'outline'}
            size="icon"
            className="flex items-center h-7 w-7 gap-2"
            disabled={row.spkrkk.length == 0}
            onClick={() => {
              row.spkrkk.length !== 0 && window.open(`${process.env.NEXT_PUBLIC_BASE_BERKAS_URL}/penggajian/${row.spkrkk[0].berkas}`, '_blank')
            }}
          >
            <IconExternalLink size={18} />
          </Button>

          <Button variant="default" size="icon" className="flex items-center h-7 w-7 gap-2" onClick={() => {
            setKaryawan(row)
            setOpen(true)
          }}>
            <IconUpload size={18} />
          </Button>
        </div>
      )
    }
  })

  return (
    <div>
      <TablePegawai
        columnsData={column}
        withTable="dpt,spkrkk"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Berkas SPK & RKK</DialogTitle>
            <DialogDescription>
              Upload berkas SPK & RKK untuk pegawai yang belum memiliki berkas SPK & RKK untuk karyawan atas nama <span className="font-bold text-warning">{karyawan?.nama}</span>
            </DialogDescription>
          </DialogHeader>
          <form action="" method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className="grid gap-2 w-full">
              <Label htmlFor="kategori">Kategori</Label>
              {kategori ? (
                <Select onValueChange={() => { }} name="berkas">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Kategori Berkas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Kategori Berkas</SelectLabel>
                      {kategori.data.map((item: any) => (
                        <SelectItem key={item.kode} value={item.kode}>{item.kategori}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <Skeleton className="w-full h-9" />
              )}
            </div>

            <div className="grid gap-2 w-full mt-4">
              <Label htmlFor="pilih_berkas">Pilih Berkas</Label>
              <Input id="pilih_berkas" type="file" name="file_berkas" />
            </div>

            <div className="flex w-full justify-end mt-4">
              <Button type="submit" variant="default" size={'sm'} className="inline-flex items-center gap-2">
                <IconUpload size={18} /> Upload
              </Button>
            </div>
          </form>

        </DialogContent>
      </Dialog>
    </div>
  )
}

berkasSPKRKK.getLayout = (page: any) => (
  <AppLayout>
    {page}
  </AppLayout>
)

export default berkasSPKRKK