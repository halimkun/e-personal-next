import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCookie } from "cookies-next"
import { useRouter } from "next/router";
import { Combobox } from "../inputs/combo-box";
import { useEffect, useState } from "react";


interface FormAddSuratInternalProps {
  setOpen: any;
}

interface selectItemType {
  value: string;
  label: string;
}

export default function FormAddSuratInternal({ setOpen }: FormAddSuratInternalProps) {
  const router = useRouter();
  const [pj, setPj] = useState<selectItemType[]>([])
  const [selectedPj, setSelectedPj] = useState("")

  useEffect(() => {
    const getPetugas = async () => {
      await fetch('https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/pegawai?datatables=1&with=bidang_detail&select=nik,nama', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + getCookie('access_token')
        }
      }).then(response => response.json())
        .then(data => {
          const dataPj = data.data.map((item: any) => {
            return {
              value: item.nik,
              label: item.nama
            }
          })
          setPj(dataPj)
        });
    }

    getPetugas()
  }, [])

  const onFormAddSuratInternalSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    // all value from input
    const tanggal = (event.target as any).tanggal.value
    const pj = (event.target as any).pj.value
    const tempat = (event.target as any).tempat.value
    const perihal = (event.target as any).perihal.value

    const response = await fetch('https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/surat/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getCookie('access_token')
      },
      body: JSON.stringify({
        tanggal: tanggal,
        pj: pj,
        tempat: tempat,
        perihal: perihal
      })
    }).then(response => response.json())

    // reload
    setOpen(false)
    router.replace(router.asPath)
  }

  return (
    <form action="#!" method="post" onSubmit={onFormAddSuratInternalSubmit}>
      <div className="grid gap-3 py-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full space-y-1">
            <Label className="" htmlFor="tanggal">Tannggal</Label>
            <Input type="datetime-local" name="tanggal" placeholder="tanggal" id="tanggal" />
          </div>
          <div className="w-full space-y-1">
            <Label className="" htmlFor="PJ">Penanggung Jawab</Label>
            <Input type="hidden" name="pj" value={selectedPj} />
            <Combobox selectItems={pj} setSelectedPj={setSelectedPj} />
          </div>
        </div>
        <div className="w-full space-y-1">
          <Label className="" htmlFor="tempat">Tempat</Label>
          <Input type="text" name="tempat" placeholder="Tempat" id="tempat" />
        </div>
        <div className="w-full space-y-1">
          <Label className="" htmlFor="perihal">Perihal</Label>
          <Input type="text" name="perihal" placeholder="perihal" id="perihal" />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button type="submit" className="btn btn-primary">Simpan</button>
      </div>
    </form>
  )
}