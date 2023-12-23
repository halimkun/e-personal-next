import toast from "react-hot-toast"
import AppLayout from "@/components/layouts/app"
import LaravelPagination from "@/components/custom/tables/laravel-pagination"

import { useRouter } from "next/router"
import { getSession } from "next-auth/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getDate, getFullDate } from "@/lib/date"
import { ReactElement, useEffect, useState } from "react"
import { Document, PDFDownloadLink } from "@react-pdf/renderer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { IconDownload, IconEdit, IconExclamationCircle, IconFileSearch, IconFileSymlink, IconPlus, IconTrash } from "@tabler/icons-react"

import PDFFile from "@/templates/pdf/spo"
import FormAddSpo from "@/components/custom/forms/add-spo"
import FormEditSpo from "@/components/custom/forms/edit-spo"
import SeparatorWithText from "@/components/custom/separator-with-text"


const SpoPage = () => {
  const router = useRouter()
  const [spo, setSpo] = useState<any>([])
  const [lastNomor, setLastNomor] = useState<any>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isFormAddOpen, setIsFormAddOpen] = useState(false)
  const [isFormEditOpen, setIsFormEditOpen] = useState(false)

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
      data: (row: any) => row.departemen ? row.departemen.nama : row.unit
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
          onClick={() => router.push(`/berkas/spo/render?nomor=${row.nomor}`)}
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
              <CardTitle>Berkas Perjanjian</CardTitle>
              <CardDescription>Daftar Berkas Perjanjian Kerjasama</CardDescription>
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

      {/* Modal Alert Menu */}
      <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Menu Standar Prosedur Operasional</DialogTitle>
            <DialogDescription>
              <Badge variant={'outline'}>{spo.nomor}</Badge>
              Anda dapat memilih menu dibawah ini untuk melakukan aksi pada SPO terpilih.
            </DialogDescription>
          </DialogHeader>

          <div className="mb-4 space-y-2 text-left">
            <table className="table w-full">
              <tbody>
                <tr>
                  <th>Nomor</th>
                  <th>:</th>
                  <td>{spo.nomor}</td>
                </tr>
                <tr>
                  <th>Judul</th>
                  <th>:</th>
                  <td>{spo.judul}</td>
                </tr>
                <tr>
                  <th>Unit</th>
                  <th>:</th>
                  <td>{spo.departemen ? spo.departemen.nama : spo.unit}</td>
                </tr>
                <tr>
                  <th>Tanggal Terbit</th>
                  <th>:</th>
                  <td>{getFullDate(spo.tgl_terbit)}</td>
                </tr>
                <tr>
                  <th>Jenis</th>
                  <th>:</th>
                  <td>{spo.jenis}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-between w-full">
            <div className="flex justify-end gap-2 w-full">
              <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => {
                setIsMenuOpen(false)
                setIsFormEditOpen(true)
              }}>
                <IconEdit className="h-4 w-4" /> Edit
              </Button>
              <Button variant="destructive" size="sm" className="flex items-center gap-2" onClick={() => window.confirm('Apakah anda yakin ingin menghapus data ini?') && onDelete()}>
                <IconTrash className="h-4 w-4" /> Hapus
              </Button>
            </div>
          </div>

          <SeparatorWithText text="spo detail" />
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => router.push(`/berkas/spo/${spo.nomor.replace(/\//g, '--')}`)}>
              <IconEdit className="h-4 w-4" /> Edit SPO
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => toast.success('under development')}>
              <IconFileSearch className="h-4 w-4" /> Lihat SPO
            </Button>
            {spoDetail && (
              <PDFDownloadLink document={spoDetail ? <PDFFile detail={spoDetail} key={spoDetail?.nomor} /> : <Document></Document>} fileName={`SPO-${spo.nomor}.pdf`}>
                {({ blob, url, loading, error }) => {
                  if (error) return 'Terjadi kesalahan saat membuat dokumen'

                  return loading ? (
                    <Button variant="outline" size="sm" className="flex items-center gap-2" disabled>
                      <IconDownload className="h-4 w-4" /> Loading...
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <IconDownload className="h-4 w-4" /> Download
                    </Button>
                  )
                }}
              </PDFDownloadLink>
            )}
          </div>
        </DialogContent>
      </Dialog>


      {/* Modal edit */}
      <Dialog open={isFormEditOpen} onOpenChange={setIsFormEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit SPO <Badge variant={'outline'}>{spo.nomor}</Badge></DialogTitle>
            <DialogDescription>
              Anda bisa mengedit data perjanjian kerjasama ini melalui form dibawah ini.
              <div className="px-3 py-2 rounded-xl border-2 border-warning mt-1.5">
                <div className="font-bold flex items-center justify-start text-warning gap-2">
                  <IconExclamationCircle className="h-4 w-4 text-warning" /> Perhatian!
                </div>
                Harap berhati-hati dalam mengedit <span className="font-bold">Nomor SPO</span> agar tidak terjadi duplikasi data.
              </div>
            </DialogDescription>
          </DialogHeader>

          <FormEditSpo data={spo} />
        </DialogContent>
      </Dialog>
    </>
  )
}

SpoPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default SpoPage;