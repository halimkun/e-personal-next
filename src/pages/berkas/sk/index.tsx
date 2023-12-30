import React, { ReactElement, useEffect } from "react"

import AppLayout from "@/components/layouts/app"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import TableSk from "@/components/custom/tables/table-sk"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"
import { getSession } from "next-auth/react"
import useSWR from "swr"
import Loading1 from "@/components/custom/icon-loading"
import FormAddSK from "@/components/custom/forms/add-sk"
import { Badge } from "@/components/ui/badge"


const SKPage = () => {
  const delayDebounceFn = React.useRef<any>(null)
  const [filterData, setFilterData] = React.useState({})
  const [filterQuery, setFilterQuery] = React.useState('')
  const [selectedData, setSelectedData] = React.useState<any>(null)

  const [date, setDate] = React.useState<Date | null>(null)
  const [isOpenMenu, setIsOpenMenu] = React.useState(false)
  const [isFormEditOpen, setIsFormEditOpen] = React.useState(false)
  const [isOpenFormAdd, setIsOpenFormAdd] = React.useState(false)
  const [jenis, setJenis] = React.useState<string | undefined>(undefined)

  const fetcher = async (url: any) => {
    const session = await getSession()
    const response = await fetch(url + filterQuery, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.rsiap?.access_token}`,
      },
    })

    if (!response.ok) {
      throw new Error(response.status + ' ' + response.statusText)
    }

    const jsonData = await response.json()
    return jsonData
  }

  const { data, error, mutate, isLoading, isValidating } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/berkas/sk`, fetcher, {
    revalidateOnFocus: false,
    refreshWhenOffline: false,
    refreshWhenHidden: true,
  })

  useEffect(() => {
    let fq = ''
    for (const [key, value] of Object.entries(filterData)) {
      if (value) {
        fq += fq === '' ? `?${key}=${value}` : `&${key}=${value}`
      }
    }

    setFilterQuery(fq)
  }, [filterData])

  useEffect(() => {
    if (delayDebounceFn.current) {
      clearTimeout(delayDebounceFn.current);
    }

    delayDebounceFn.current = setTimeout(() => {
      mutate();
    }, 250);

    return () => clearTimeout(delayDebounceFn.current);
  }, [filterQuery]);

  if (isLoading) return <Loading1 height={50} width={50} />
  if (error) return <div>{error.message}</div>
  if (!data) return <div>No data</div>

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <CardTitle>Surat Keputusan Direktur</CardTitle>
              <CardDescription>Data Surat Keputusan Direktur</CardDescription>
            </div>
            <Button size={'icon'} className="w-7 h-7" onClick={() => setIsOpenFormAdd(true)}>
              <IconPlus className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TableSk
            data={data}
            filterData={filterData}
            setFilterData={setFilterData}
            key={data.data?.current_page}
            isValidating={isValidating}
            onRowClick={(item: any) => {
              setSelectedData(item)
              setIsOpenMenu(true)
            }}
          />
        </CardContent>
      </Card>

      <Dialog open={isOpenMenu} onOpenChange={setIsOpenMenu}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Menu SK Direktur</DialogTitle>
          </DialogHeader>

          <Button variant={'outline'} size={'sm'} onClick={() => {
            setIsFormEditOpen(true)
            setIsOpenMenu(false)
          }} >
            Edit SK
          </Button>
        </DialogContent>
      </Dialog>

      {/* Modal Edit */}
      <Dialog open={isFormEditOpen} onOpenChange={setIsFormEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Surat Keputusan Direktur</DialogTitle>
            <DialogDescription>
              {selectedData ? (
                <Badge variant={selectedData.status === '1' ? 'default' : 'destructive'} className="mr-2">
                  {`${selectedData.nomor.toString().padStart(3, '0')}/${selectedData.jenis}/${selectedData.prefix}/${new Date(selectedData.tgl_terbit).toLocaleDateString('id-ID', {
                    year: '2-digit',
                    month: '2-digit',
                    day: '2-digit'
                  }).split('/').join('')}`}
                </Badge>
              ) : <></>}
              You can edit this data. but be careful editing number can cause duplicate data in the database and possibly cause errors.
            </DialogDescription>
          </DialogHeader>
          <FormAddSK
            data={selectedData}
            date={date}
            setDate={setDate}
            jenis={jenis}
            setJenis={setJenis}
            setIsOpenFormAdd={setIsFormEditOpen}
            mutate={mutate}
          />
        </DialogContent>
      </Dialog>

      {/* Modal Form Add */}
      <Dialog open={isOpenFormAdd} onOpenChange={setIsOpenFormAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Surat Keputusan Direktur</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <FormAddSK
            date={date}
            setDate={setDate}
            jenis={jenis}
            setJenis={setJenis}
            setIsOpenFormAdd={setIsOpenFormAdd}
            mutate={mutate}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}


SKPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default SKPage