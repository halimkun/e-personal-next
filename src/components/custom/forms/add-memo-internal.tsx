import { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePickerDemo } from "../inputs/date-picker";
import { IconUsersPlus, IconX } from "@tabler/icons-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"

import dynamic from "next/dynamic";
import { getSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { Combobox } from "../inputs/combo-box";
import { MultiSelect } from "../inputs/multi-select";

const Editor = dynamic(
  () => import('@/components/custom/editor'),
  { ssr: false }
)

const FormAddMemoInternal = (props: any) => {
  const { pj } = props

  const route = useRouter()

  const [isiKonten, setIsiKonten] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tglTerbit, setTglTerbit] = useState<Date | null>(new Date())

  const [selectedPenerimaLabel, setSelectedPenerimaLabel] = useState<string[]>([]);
  const [selectedPenerimaValue, setSelectedPenerimaValue] = useState<string[]>([]);

  const onSubmit = async (e: any) => {
    e.preventDefault()
    setIsSubmitting(true)

    const session = await getSession();
    const data = new FormData(e.target);

    // add tglTerbit to data
    data.append('tanggal', tglTerbit?.toISOString().slice(0, 10) ?? '')
    data.append('content', isiKonten)
    data.append('penerima', JSON.stringify(selectedPenerimaValue))
    // 

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/berkas/memo/internal/store`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + session?.rsiap?.access_token
      },
      body: data
    }).then(response => response.json())

    if (response.success) {
      setIsSubmitting(false)
      toast.success(response.message)
      await new Promise(resolve => setTimeout(resolve, 1500))

      route.push('/memo/internal')
    } else {
      setIsSubmitting(false)
      toast.error(response.message)
    }

  }

  return (
    <div className="w-full">
      <form method="post" onSubmit={onSubmit} className="flex gap-3 flex-col md:flex-row items-start">
        <Card className="w-full top-16 lg:sticky">
          <CardHeader>
            <CardTitle>Buat Memo Internal Baru</CardTitle>
            <CardDescription>Isi form dibawah ini untuk membuat memo internal baru</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col lg:flex-row gap-2">
                <div className="space-y-1 w-full">
                  <Label className="text-primary font-semibold">Dari</Label>
                  <Input placeholder="pengirim memo" name="dari" />
                </div>

                <div className="space-y-1 w-[70%]">
                  <Label className="text-primary font-semibold" htmlFor="tgl_terbit">Tanggal Terbit</Label>
                  <DatePickerDemo
                    date={tglTerbit}
                    setDate={setTglTerbit}
                    placeholder="pilih tanggal"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-primary font-semibold">Perihal</Label>
                <Input placeholder="perihal memo internal" name="perihal" />
              </div>
              <div className="space-y-1">
                <Label className="text-primary font-semibold">Isi Konten</Label>
                <Editor
                  value={isiKonten}
                  onChange={(data: any) => setIsiKonten(data)}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                className="bg-primary text-white hover:bg-primary-600"
              // disabled={isSubmitting}
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Memo'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full lg:w-[60%] top-16 lg:sticky">
          <CardHeader>
            <CardTitle>Penerima</CardTitle>
            <CardDescription>Anda bisa menambahkan beberapa penerima memo ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full space-y-1 mb-6">
              <Label className="text-primary" htmlFor="PJ">Penanggung Jawab</Label>
              <Input type="hidden" name="pj" value={selectedPenerimaLabel} />
              <MultiSelect
                options={pj}
                selected={selectedPenerimaLabel}
                onChange={setSelectedPenerimaLabel}
                valueSelected={selectedPenerimaValue}
                onValueChange={setSelectedPenerimaValue}
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export default FormAddMemoInternal