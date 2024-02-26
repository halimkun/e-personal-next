import { getDate } from "@/lib/date";
import { useRouter } from "next/router";
import { Badge } from "@/components/ui/badge";
import { getSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ReactElement, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { IconArrowLeft, IconFileSearch, IconLoader, IconTrash } from "@tabler/icons-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import useSWR from "swr";
import dynamic from 'next/dynamic'

const AppLayout = dynamic(() => import('@/components/layouts/app'), { ssr: false })
const UploadBerkasKaryawan = dynamic(() => import('@/components/custom/modals/upload-berkas-karyawan'), { ssr: false })
const DialogPreviewBerkas = dynamic(() => import('@/components/custom/modals/dialog-preview-berkas'), { ssr: false })

const BerkasKaryawan = () => {
  const router = useRouter()
  const [selectedBerkas, setSelectedBerkas] = useState<any>('')
  const [isPreview, setIsPreview] = useState<boolean>(false)
  const [data, setData] = useState<any>({
    nama: "",
    nik: "",
    jbtn: "",
    bidang: "",
    berkas: []
  })

  const handleDelete = async (kode: string, berkas: string) => {
    const confirm = window.confirm("Apakah anda yakin ingin menghapus berkas ini?")
    const session = await getSession()
    if (!confirm) return

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pegawai/delete/berkas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.rsiap?.access_token}`,
      },
      body: JSON.stringify({
        nik: router.query.nik,
        kode: kode,
        berkas: berkas
      })
    }).then(res => res.json()).then(data => {
      if (data.success) {
        toast({
          title: "Berhasil",
          description: "Berhasil menghapus berkas",
        })

        router.replace(router.asPath)
      } else {
        toast({
          title: "Gagal",
          description: "Gagal menghapus berkas",
        })
      }
    })
  }

  const fetcher = async (url: string) => {
    const session = await getSession()
    if (router.isReady) {
      return await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.rsiap?.access_token}`,
        },
        body: JSON.stringify({ nik: router.query.nik })
      }).then(res => {
        if (!res.ok) {
          throw Error(res.status + ' ' + res.statusText)
        }

        const response = res.json()
        response.then((data) => {
          setData(data.data)
        })
        return response
      })
    }
  }

  const { data: berkas, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/pegawai/get/berkas`, fetcher)

  if (error) return (
    <div className="flex flex-col items-start justify-center h-full gap-4">
      <div className="text-2xl font-bold">Error {error.message}</div>
    </div>
  )
  if (!berkas) return (
    <div className="flex flex-col items-start justify-center h-full gap-4">
      <IconLoader className="animate-spin w-7 h-7" />
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      {data.berkas.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Button variant="outline" size='icon' onClick={() => router.back()}>
                <IconArrowLeft className="rotate-0 scale-100 transition-all" />
              </Button>
              <div className="flex w-full items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Berkas Karyawan</CardTitle>
                  <CardDescription>Berkas Karyawan <strong>RSIA Aisyiyah Pekajangan</strong></CardDescription>
                </div>
                <UploadBerkasKaryawan nik={router.query.nik} />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="mb-5 flex items-center gap-7">
              <table>
                <tbody>
                  <tr>
                    <th className="text-left">Nama</th>
                    <th><span className="px-4">:</span></th>
                    <td>{data.nama}</td>
                  </tr>
                  <tr>
                    <th className="text-left">NIK</th>
                    <th><span className="px-4">:</span></th>
                    <td>{data.nik}</td>
                  </tr>
                </tbody>
              </table>

              <table>
                <tbody>
                  <tr>
                    <th className="text-left">Jabatan</th>
                    <th><span className="px-4">:</span></th>
                    <td>{data.jbtn}</td>
                  </tr>
                  <tr>
                    <th className="text-left">Bidang</th>
                    <th><span className="px-4">:</span></th>
                    <td>{data.bidang}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3">
              {data.berkas.map((item: any, index: number) => {
                return (
                  <div className="p-4 rounded-lg border flex flex-col justify-between bg-background hover:scale-[.97] transition-all duration-200 ease-in-out" key={index}>
                    <div>
                      <div className="flex flex-col gap-1">
                        <p className="text-lg font-bold">Berkas {item.master_berkas_pegawai.nama_berkas}</p>
                        <div className="flex gap-2 items-center">
                          <Badge variant="outline" className="mt-2">
                            {item.master_berkas_pegawai.kategori}
                          </Badge>
                          <Badge variant="outline" className="mt-2 bg-secondary">
                            {getDate(item.tgl_uploud)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end items-center">
                      <Button variant='destructive' size="icon" className="h-8 w-8" onClick={() => handleDelete(item.master_berkas_pegawai.kode, item.berkas)}><IconTrash className="h-5 w-5" /></Button>
                      <Button size="icon" className="h-8 w-8" onClick={() => {
                        setSelectedBerkas(item.berkas)
                        setIsPreview(true)
                      }}>
                        <IconFileSearch className="h-5 w-5" />
                      </Button>

                      <DialogPreviewBerkas
                        berkasUrl={`${process.env.NEXT_PUBLIC_BASE_BERKAS_URL}/penggajian/${selectedBerkas}`}
                        isPreview={isPreview}
                        setIsPreview={setIsPreview}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Button variant="outline" size='icon' onClick={() => router.back()}>
                <IconArrowLeft className="rotate-0 scale-100 transition-all" />
              </Button>
              <div className="flex w-full items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Berkas Karyawan</CardTitle>
                  <CardDescription>Berkas Karyawan <strong>RSIA Aisyiyah Pekajangan</strong></CardDescription>
                </div>
                <UploadBerkasKaryawan nik={router.query.nik} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <p className="text-sm">Berkas karyawan dengan nik <Badge variant='outline'>{router.query.nik}</Badge> tidak ditemukan.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
};

BerkasKaryawan.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default BerkasKaryawan;