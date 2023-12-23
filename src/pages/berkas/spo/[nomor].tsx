import AppLayout from "@/components/layouts/app"
import { useRouter } from "next/router"
import { ReactElement, useEffect, useState } from "react"

import dynamic from 'next/dynamic'
import { getSession } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconArrowLeft } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import Loading1 from "@/components/custom/icon-loading"
import toast from "react-hot-toast"



const detail = {
  nomor: '',
  pengertian: '',
  tujuan: '',
  kebijakan: '',
  prosedur: '',
}

const Editor = dynamic(
  () => import('@/components/custom/editor'),
  { ssr: false }
)

const SpoDetailPage = () => {
  const router = useRouter()

  const { nomor: n } = router.query
  const nomor = n?.toString().replaceAll('--', '/')

  const [pengertian, setPengertian] = useState('')
  const [tujuan, setTujuan] = useState('')
  const [kebijakan, setKebijakan] = useState('')
  const [prosedur, setProsedur] = useState('')

  const [detailData, setDetailData] = useState(detail)

  useEffect(() => {
    const getSpo = async () => {
      const session = await getSession()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/berkas/spo/show?nomor=${nomor}`, {
        'method': 'GET',
        'headers': {
          'Authorization': `Bearer ${session?.rsiap?.access_token}`
        }
      })
      const data = await res.json()

      if (data.success) {
        // decode all html entities
        const decodedPengertian = decodeHtml(data.data.detail?.pengertian ?? '')
        const decodedTujuan = decodeHtml(data.data.detail?.tujuan ?? '')
        const decodedKebijakan = decodeHtml(data.data.detail?.kebijakan ?? '')
        const decodedProsedur = decodeHtml(data.data.detail?.prosedur ?? '')

        setPengertian(decodedPengertian)
        setTujuan(decodedTujuan)
        setKebijakan(decodedKebijakan)
        setProsedur(decodedProsedur)

        setDetailData({
          ...detailData,
          nomor: data.data.nomor,
          pengertian: decodedPengertian,
          tujuan: decodedTujuan,
          kebijakan: decodedKebijakan,
          prosedur: decodedProsedur
        })
      }
    }

    getSpo()
  }, [nomor])

  useEffect(() => {
    setDetailData({
      ...detailData,
      pengertian,
      tujuan,
      kebijakan,
      prosedur
    } as any)
  }, [pengertian, tujuan, kebijakan, prosedur])

  async function onSubmit(e: any) {
    e.preventDefault()
    const session = await getSession()

    const data = new FormData(e.target)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/berkas/spo/detail/store`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.rsiap?.access_token}`
      },
      body: data
    })

    const result = await res.json()
    if (result.success) {
      toast.success('Data Spo berhasil disimpan')
      await new Promise(r => setTimeout(r, 1000))
      router.push(`/berkas/spo/${n}`)
    }
  }

  function decodeHtml(html: string) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (router.isReady) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="outline" size='icon' onClick={() => router.back()}>
              <IconArrowLeft className="rotate-0 scale-100 transition-all" />
            </Button>
            <div className="flex flex-col gap-0.5">
              <CardTitle>Edit Surat Internal</CardTitle>
              <CardDescription>Edit detail Surat Internal dengan nomor <Badge variant='outline' className="ml-2">{nomor}</Badge> </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {nomor ? (
            <form onSubmit={onSubmit}>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-primary">Nomor SPO</Label>
                  <Input name="nomor" value={nomor} readOnly />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-primary">Pengertian</Label>
                    <Input type="hidden" name="pengertian" value={pengertian} />
                    <Editor
                      value={pengertian}
                      onChange={(data: any) => setPengertian(data)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-primary">Tujuan</Label>
                    <Input type="hidden" name="tujuan" value={tujuan} />
                    <Editor
                      value={tujuan}
                      onChange={(data: any) => setTujuan(data)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-primary">Kegiatan</Label>
                    <Input type="hidden" name="kebijakan" value={kebijakan} />
                    <Editor
                      value={kebijakan}
                      onChange={(data: any) => setKebijakan(data)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-primary">Prosedur</Label>
                    <Input type="hidden" name="prosedur" value={prosedur} />
                    <Editor
                      value={prosedur}
                      onChange={(data: any) => setProsedur(data)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button type="submit" variant="default">
                  Simpan
                </Button>
              </div>
            </form>
          ) : (
            <Loading1 />
          )}
        </CardContent>
      </Card>

    )
  }
}

// export async function getServerSideProps(ctx: any) {
//   const session = await getSession(ctx)

//   return {
//     props: {}
//   }
// }

SpoDetailPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default SpoDetailPage