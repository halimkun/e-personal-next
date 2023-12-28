import toast from "react-hot-toast"
import AppLayout from "@/components/layouts/app"
import LaravelPagination from "@/components/custom-ui/laravel-pagination"

import { useRouter } from "next/router"
import { getSession } from "next-auth/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getDate } from "@/lib/date"
import { ReactElement, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { IconFileSymlink, IconPlus } from "@tabler/icons-react"

import FormAddSpo from "@/components/custom/forms/add-spo"
import dynamic from "next/dynamic"

const DialogEditSpo = dynamic(() => import('@/components/custom/modals/dialog-edit-spo'), { ssr: false })
const DialogMenuSpo = dynamic(() => import('@/components/custom/modals/dialog-menu-spo'), { ssr: false })
const DialogViewSpo = dynamic(() => import('@/components/custom/modals/view-spo'), { ssr: false })

const SpoPage = () => {
  const router = useRouter()
  const [spo, setSpo] = useState<any>([])
  const [lastNomor, setLastNomor] = useState<any>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isFormAddOpen, setIsFormAddOpen] = useState(false)
  const [isFormEditOpen, setIsFormEditOpen] = useState(false)
  const [isViewSpoOpen, setIsViewSpoOpen] = useState(false)

  const [spoDetail, setSpoDetail] = useState<any>(null)

  useEffect(() => {
    const getSpoDetail = async () => {
      const session = await getSession()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/berkas/spo/show?nomor=${spo.nomor}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session?.rsiap?.access_token}`
        }
      })

      const data = await res.json()
      if (data.success && data.data.detail) {
        setSpoDetail(data.data)
      } else {
        setSpoDetail(null)
      }
    }

    getSpoDetail()

  }, [spo.nomor])

  useEffect(() => {
    const getLastNomor = async () => {
      const session = await getSession()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/berkas/spo/last-nomor`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session?.rsiap?.access_token}`
        }
      })

      const data = await res.json()
      if (data.success) {
        setLastNomor(data.data)
      }
    }

    getLastNomor()
  }, [])

  const onDelete = async () => {
    const session = await getSession()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/berkas/spo/delete?nomor=${spo.nomor}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session?.rsiap?.access_token}`
      }
    })

    const data = await res.json()

    if (data.success) {
      toast.success(data.message)
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.reload()

      setIsMenuOpen(false)
    } else {
      toast.error(data.message)
    }
  }

  const spoCol = [
    {
      name: 'Nomor',
      selector: 'no_surat',
      data: (row: any) => (
        <Badge variant="outline" className="whitespace-nowrap group-hover:border-primary">{row.nomor}</Badge>
      )
    },
    {
      name: 'Unit',
      selector: 'unit',
      data: (row: any) => {
        const u = row.unit.split(',')
        const badge = u.length > 1 ? u.slice(0, 1) : u
        // loop u and make badge if badge more than 2 then make badge with +n
        return (
          <div className="flex flex-row items-start gap-1.5">
            {badge.map((item: any, i: number) => (
              <Badge variant="outline" className="max-w-[138px] group-hover:border-primary" key={i}>{item}</Badge>
            ))}
            {u.length > 1 && <Badge variant="outline" className="whitespace-nowrap group-hover:border-primary">+{u.length - 1}</Badge>}
          </div>
        )
      }
    },
    {
      name: 'Judul',
      selector: 'judul',
      data: (row: any) => (
        <div className="">
          {row.judul}
        </div>
      )
    },
    {
      name: 'Tanggal Terbit',
      selector: 'tanggal_terbit',
      style: ['text-right whitespace-nowrap'],
      data: (row: any) => (
        <div className='text-right'>
          <div className="md:whitespace-nowrap">{getDate(row.tgl_terbit)}</div>
        </div>
      )
    }, {
      name: "#",
      selector: 'Action',
      data: (row: any) => (
        <Button variant={'default'} size="icon" className="h-6 w-6"
          disabled={!row.detail}
          onClick={() => {
            setSpo(row)
            setIsViewSpoOpen(true)
          }}
        >
          <IconFileSymlink className="h-4 w-4" />
        </Button>
      )
    }
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <CardTitle>Berkas Standar Prosedur Operasional</CardTitle>
              <CardDescription>Data Berkas Standar Prosedur Operasional</CardDescription>
            </div>
            <Dialog open={isFormAddOpen} onOpenChange={setIsFormAddOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="icon" className="w-7 h-7" onClick={() => {
                  setSpo([])
                }}>
                  <span className="sr-only">Open menu</span>
                  <IconPlus className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle className="text-primary">Entri Data SPO</DialogTitle>
                  <DialogDescription>Tambahkan data SPO baru</DialogDescription>
                </DialogHeader>
                <FormAddSpo lastNomor={lastNomor} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <LaravelPagination
            columns={spoCol}
            onRowClick={(row: any) => {
              setSpo(row)
              setIsMenuOpen(true)
            }}
            dataSrc={`${process.env.NEXT_PUBLIC_API_URL}/berkas/spo`}
            fetcher={{ method: "GET" }}
          />
        </CardContent>
      </Card>

      {/* Dialog Menu */}
      <DialogMenuSpo
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        spo={spo}
        onDelete={onDelete}
        setIsFormEditOpen={setIsFormEditOpen}
        spoDetail={spoDetail}
        key={spo.nomor}
        setIsViewSpoOpen={setIsViewSpoOpen}
      />

      {/* Dialog Edit */}
      <DialogEditSpo
        isFormEditOpen={isFormEditOpen}
        setIsFormEditOpen={setIsFormEditOpen}
        spo={spo}
      />

      {/* Dialog View SPO */}
      <DialogViewSpo 
        show={isViewSpoOpen}
        onHide={() => setIsViewSpoOpen(false)}
        spo={spo}
      />
    </>
  )
}

SpoPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default SpoPage;