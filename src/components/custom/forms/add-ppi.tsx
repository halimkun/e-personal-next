import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { DatePickerDemo } from "../inputs/date-picker"
import { Combobox } from "../inputs/combo-box"
import { IconLoader } from "@tabler/icons-react"
import { getSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

import useSWR from "swr"

interface formAddPpiProps {
  onSubmitted: any
  penanggungJawab?: any
  setPenanggungJawab?: any
  tglTerbit?: any
  setTglTerbit?: any
}

const FormAddPPI = (props : formAddPpiProps) => {
  const { onSubmitted, penanggungJawab, setPenanggungJawab, tglTerbit, setTglTerbit } = props
  const [pj, setPj] = useState<any>(null)

  const fetcher = async (url: string) => {
    const session = await getSession()
    return await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.rsiap?.access_token}`,
      },
    }).then(response => {
      if (!response.ok) {
        throw Error(response.status + ' ' + response.statusText)
      }

      const data = response.json()
      const result = data.then((res) => {
        const data = res.data.map((item: any) => {
          return {
            value: item.nik,
            label: item.nama
          }
        })
        setPj(data)
      })

      return data
    })
  }

  const { data: dataPj, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/pegawai?datatables=1&with=bidang_detail&select=nik,nama`, fetcher);

  return (
    <form action="" method="post" onSubmit={onSubmitted}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
          <div className="space-y-1 w-full">
            <Label className="text-primary font-semibold" htmlFor="tgl_terbit">Tanggal Terbit</Label>
            <DatePickerDemo
              date={tglTerbit}
              setDate={setTglTerbit}
              placeholder="pilih tanggal"
            />
          </div>
          {
            pj ? (
              <div className="space-y-1 w-full">
                <Label className="text-primary font-semibold">Penanggung Jawab</Label>
                <Combobox
                  items={pj}
                  setSelectedItem={setPenanggungJawab}
                  selectedItem={penanggungJawab}
                  placeholder="Penanggung Jawab"
                />
              </div>
            ) : (
              <div className="w-full flex items-center space-x-2">
                <IconLoader className="animate-spin h-5 w-5" />
                <span>Loading Penanggung Jawab...</span>
              </div>
            )
          }
        </div>

        <div className="space-y-1 w-full">
          <Label htmlFor="perihal" className="text-primary font-semibold">Perihal</Label>
          <Textarea name="perihal" id="perihal" placeholder="perihal berkas" />
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button type="submit" variant="default">Simpan</Button>
      </div>
    </form>
  );
}

export default FormAddPPI;