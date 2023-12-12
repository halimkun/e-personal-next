import AppLayout from "@/components/layouts/app"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getDate, getTime } from "@/lib/date"
import { cn } from "@/lib/utils"
import { NextPageWithLayout } from "@/pages/_app"
import { IconArrowLeft, IconLoader } from "@tabler/icons-react"
import { getSession } from "next-auth/react"
import { useRouter } from "next/router"
import { ReactElement } from "react"
import useSWR from "swr"

const DetailSuratInternal: NextPageWithLayout = () => {
  const route = useRouter();
  const nomor = route.query.nomor?.toString().replace(/_/g, '/')

  const fetcher = async (url: string) => {
    const session = await getSession()
    if (route.isReady) {
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.rsiap?.access_token}`,
        },
        body: JSON.stringify({
          nomor: nomor
        })
      }).then(res => res.json())
    }
  }

  const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/surat/internal/detail`, fetcher)

  if (error) return (
    <div className="flex flex-col items-start justify-center h-full gap-4">
      <div className="text-2xl font-bold">Error {error.message}</div>
    </div>
  )

  if (!data) return (
    <div className="flex flex-col items-start justify-center h-full gap-4">
      <IconLoader className="animate-spin w-10 h-10" />
    </div>
  )

  const detail = data.data

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" size='icon' onClick={() => route.push('/surat/internal')}>
            <IconArrowLeft className="rotate-0 scale-100 transition-all" />
          </Button>
          <div className="flex flex-col gap-0.5">
            <CardTitle>Detail Surat Internal</CardTitle>
            <CardDescription>Detail Surat Internal dengan nomor <Badge variant='outline' className="ml-2">{detail.no_surat}</Badge> </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-4">
          <table className="table w-full">
            <tr>
              <th className="text-left">Nomor Surat</th>
              <th>:</th>
              <td className="p-2">{nomor}</td>
            </tr>
            <tr>
              <th className="text-left">Perihal</th>
              <th>:</th>
              <td className="p-2">{detail.perihal}</td>
            </tr>
            <tr>
              <th className="text-left">Penanggung Jawab</th>
              <th>:</th>
              <td className="p-2">{detail.pj_detail ? detail.pj_detail.nama : detail.pj}</td>
            </tr>
            <tr>
              <th className="text-left">Tempat</th>
              <th>:</th>
              <td className="p-2">{detail.tempat}</td>
            </tr>
            <tr>
              <th className="text-left">Tanggal</th>
              <th>:</th>
              <td className="p-2">{getDate(detail.tanggal)} {getTime(detail.tanggal)}</td>
            </tr>
            <tr>
              <th className="text-left">Status</th>
              <th>:</th>
              <td className="p-2">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "px-3 text-sm rounded-full flex items-center justify-center", {
                    'bg-green-200 border-2 border-green-500 text-green-800': detail.status === 'disetujui',
                    'bg-red-200 border-2 border-red-500 text-red-800': detail.status === 'ditolak',
                    'bg-yellow-200 border-2 border-yellow-500 text-yellow-800': detail.status === 'pengajuan'
                  }
                  )}>
                    {detail.status}
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th className="text-left">Jumlah Penerima</th>
              <th>:</th>
              <td className="p-2">
                {detail.penerima.length}
              </td>
            </tr>
          </table>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {detail.penerima.map((item: any, index: number) => (
            <div className="p-3 rounded border border-border hover:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-150 ease-in-out" key={index}>
              <div className="font-bold">{item.pegawai ? item.pegawai.nama : item.penerima}</div>
              <div className="text-sm text-gray-500">{item.pegawai ? item.penerima : "-"}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

DetailSuratInternal.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}
export default DetailSuratInternal