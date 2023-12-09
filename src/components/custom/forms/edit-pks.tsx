import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Combobox } from '../inputs/combo-box';
import { Button } from "@/components/ui/button";
import { IconInnerShadowTop } from '@tabler/icons-react';

interface Props {
  pks: any
}

const FormEditPks = (props: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const [pjSelected, setPjSelected] = useState<string | undefined>(props.pks?.pj ?? undefined);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true)

    const session = await getSession();
    const d = new FormData(e.target);

    const res = await fetch(`https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/berkas/pks/${props.pks?.id}`, {
      method: 'POST',
      body: d,
      headers: {
        'Authorization': `Bearer ${session?.rsiap?.access_token}`
      }
    });

    const result = await res.json();
    if (result.success) {
      toast.success('Data berhasil disimpan!');
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.reload()
    } else {
      if (typeof result.message === 'object') {
        Object.entries(result.message).forEach(([key, value]) => {
          toast.error(`${key}: ${value}`)
        })
      } else {
        toast.error(result.message)
      }
    }

    setIsLoading(false)
  }

  return (
    <form method="post" encType="multipart/form-data" onSubmit={onSubmit}>
      <Input type="hidden" id="id" name="id" defaultValue={props.pks?.id} />
      <div className="mb-4 space-y-1.5">
        <Label className="text-primary font-semibold" htmlFor="judul">Judul</Label>
        <Input type="text" id="judul" name="judul" placeholder="Judul / Nama berkas" defaultValue={props.pks?.judul} />
      </div>

      <div className="grid grid-cols-2 gap-3 gap-y-1">
        {/* tanggal awal dan akhir */}
        <div className="mb-4 space-y-1.5">
          <Label className="text-primary font-semibold" htmlFor="tanggal_awal">Tanggal Awal</Label>
          {/* get date now yyyy-MM-dd */}
          <Input type="date" id="tanggal_awal" name="tanggal_awal" placeholder="Tanggal Awal" defaultValue={props.pks?.tanggal_awal} />
        </div>
        <div className="mb-4 space-y-1.5">
          <Label className="text-primary font-semibold" htmlFor="tanggal_akhir">Tanggal Ahir</Label>
          <Input type="date" id="tanggal_akhir" name="tanggal_akhir" placeholder="Tanggal Ahir" defaultValue={props.pks?.tanggal_akhir} />
        </div>
        {/* No Pks Intenal Dan Eksternal */}
        <div className="mb-4 space-y-1.5">
          <Label className="text-primary font-semibold" htmlFor="no_pks_internal">No. PKS Internal</Label>
          <Input type="text" id="no_pks_internal" name="no_pks_internal" placeholder="No. PKS Internal" defaultValue={props.pks?.no_pks_internal} />
        </div>
        <div className="mb-4 space-y-1.5">
          <Label className="text-primary font-semibold" htmlFor="no_pks_eksternal">No. PKS Eksternal</Label>
          <Input type="text" id="no_pks_eksternal" name="no_pks_eksternal" placeholder="No. PKS Eksternal" defaultValue={props.pks?.no_pks_eksternal} />
        </div>
      </div>
      <div className="mb-4 space-y-1.5">
        <Label className="text-primary font-semibold" htmlFor="pj">Penanggung Jawab</Label>
        <Input type="hidden" id="pj" name="pj" defaultValue={pjSelected} />
        <Combobox items={[
          { label: "Kicky Eka Shelviani, M.S.M", value: "3.925.0123" },
          { label: "Nuranisa Heristiani, Amd.Keb", value: "2.318.0217" },
          { label: "Satya Putranto, S.E", value: "3.903.0916" },
          { label: "Immawan Hudayanto, ST", value: "3.901.1209" },
        ]} setSelectedItem={setPjSelected} selectedItem={pjSelected} placeholder="Pilih Penanggung Jawab" />
      </div>

      <div className="mb-4 space-y-1.5">
        <Label className="text-primary font-semibold" htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" placeholder="File" />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" variant="default">
          {isLoading ? (
            <span className="flex items-center justify-center gap-2 w-full">
              <IconInnerShadowTop className="h-4 w-4 animate-spin" /> {'Uploading...'}
            </span>
          ) : 'Simpan'}
        </Button>
      </div>
    </form>
  )
}

export default FormEditPks;