import AppLayout from "@/components/layouts/app";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDate } from "@/lib/date";
import { ReactElement } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"


const BerkasKaryawan = ({ berkas, nik }: any) => {
  // https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/pegawai/get/berkas

  return (
    <div className="flex flex-col gap-4">
      {berkas.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Berkas Karyawan</CardTitle>
            <CardDescription>Berkas Karyawan <strong>RSIA Aisyiyah Pekajangan</strong></CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="mb-4">
              <Badge variant="outline" className="mt-2">{nik}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3">
              {
                berkas.map((item: any, index: number) => {
                  return (
                    <div className="p-4 rounded-lg border flex flex-col justify-between bg-background hover:scale-[.97] transition-all duration-200 ease-in-out">
                      <div>
                        <div className="flex flex-col gap-1">
                          <p className="text-lg font-bold">Berkas {item.master_berkas_pegawai.nama_berkas}</p>
                          <div className="flex gap-2 items-center">
                            <Badge variant="outline" className="mt-2">
                              {item.master_berkas_pegawai.kategori}
                            </Badge>
                            <Badge variant="outline" className="mt-2 bg-secondary">
                              <p>{getDate(item.tgl_uploud)}</p>
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end items-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button>Lihat</Button>
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
                })
              }
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
      berkas: data.data,
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