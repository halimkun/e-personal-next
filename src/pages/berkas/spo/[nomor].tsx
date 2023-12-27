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

  const [detailData, setDetailData] = useState<any>({
    nomor: '',
    pengertian: '',
    tujuan: '',
    kebijakan: '',
    prosedur: '',
  })

  useEffect(() => {
    const getSpo = async () => {
      try {
        const session = await getSession()
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/berkas/spo/show?nomor=${nomor}`, {
          'method': 'GET',
          'headers': {
            'Authorization': `Bearer ${session?.rsiap?.access_token}`
          }
        })
        const data = await res.json()

        if (data.success) {
          const decodeHtml = (html: string) => {
            var txt = document.createElement("textarea");
            txt.innerHTML = html;
            return txt.value;
          }

          if (data.data.detail) {
            const updatedDetailData = {
              nomor: data.data.nomor,
              pengertian: decodeHtml(data.data.detail?.pengertian),
              tujuan: decodeHtml(data.data.detail?.tujuan),
              kebijakan: decodeHtml(data.data.detail?.kebijakan),
              prosedur: decodeHtml(data.data.detail?.prosedur),
            };

            setDetailData(updatedDetailData);
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    getSpo()
  }, [nomor])

  async function onSubmit(e: any) {
    e.preventDefault()
    try {
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
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setDetailData({
      ...detailData,
      pengertian,
      tujuan,
      kebijakan,
      prosedur
    } as any)
  }, [pengertian, tujuan, kebijakan, prosedur])


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
                  {['pengertian', 'tujuan', 'kebijakan', 'prosedur'].map((field) => (
                    <div className="space-y-1" key={field}>
                      <Label className="text-primary">{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                      <Input type="hidden" name={field} value={detailData[field]} />
                      <Editor
                        value={detailData[field]}
                        onChange={(data: any) => setDetailData((prevData: any) => ({ ...prevData, [field]: data }))}
                      />
                    </div>
                  ))}
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

SpoDetailPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default SpoDetailPage