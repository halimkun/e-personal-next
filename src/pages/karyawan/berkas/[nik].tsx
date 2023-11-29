import AppLayout from "@/components/layouts/app";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDate } from "@/lib/date";
import { ReactElement } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import UploadBerkasKaryawan from "@/components/custom/modals/upload-berkas-karyawan";
import { IconFileSearch, IconTrash } from "@tabler/icons-react";
import { getCookie } from "cookies-next";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";


const BerkasKaryawan = ({ data, nik }: any) => {
  const router = useRouter()

  const handleDelete = async (nik: string, kode: string, berkas: string) => {
    const confirm = window.confirm("Apakah anda yakin ingin menghapus berkas ini?")
    if (!confirm) return

    await fetch('https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/pegawai/delete/berkas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getCookie('access_token')}`,
      },
      body: JSON.stringify({
        nik: nik,
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

  return (
    <div className="flex flex-col gap-4">
      {data.berkas.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <CardTitle>Berkas Karyawan</CardTitle>
                <CardDescription>Berkas Karyawan <strong>RSIA Aisyiyah Pekajangan</strong></CardDescription>
              </div>
              <UploadBerkasKaryawan nik={nik} />
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
                      <Button variant='destructive' size="icon" className="h-8 w-8" onClick={() => handleDelete(nik, item.master_berkas_pegawai.kode, item.berkas)}><IconTrash className="h-5 w-5" /></Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="icon" className="h-8 w-8"><IconFileSearch className="h-5 w-5" /></Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md md:max-w-2xl lg:max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Preview Berkas</DialogTitle>
                          </DialogHeader>
                          <iframe src={"https://sim.rsiaaisyiyah.com/webapps/penggajian/" + item.berkas} className="w-full h-[calc(100vh-110px)]"></iframe>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-lg">Berkas Karyawan</p>
          <p className="text-sm">Berkas karyawan dengan NIK tidak ditemukan.</p>
        </div>
      )}
    </div>
  )
};

export async function getServerSideProps(context: any) {
  const { nik } = context.params

  const res = await fetch(`https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/pegawai/get/berkas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${context.req.cookies.access_token}`,
    },
    body: JSON.stringify({ nik: nik })
  });

  const data = await res.json();

  return {
    props: {
      data: data.data,
      nik: nik
    },
  }
}


BerkasKaryawan.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default BerkasKaryawan;