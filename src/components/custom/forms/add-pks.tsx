import toast from "react-hot-toast";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Combobox } from "../inputs/combo-box";
import { Button } from "@/components/ui/button";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


interface FormAddPksProps {
  typeSelected?: 'internal' | 'eksternal',
  tglAwal: string,
  setTglAwal: any,
  lastNomor: {
    internal: string | null,
    eksternal: string | null
  }
}

const FormAddPks = ({ typeSelected, tglAwal, setTglAwal, lastNomor }: FormAddPksProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false)
  const [nomorPks, setNomorPks] = useState<string>('');
  const [selected, setSelected] = useState<string | undefined>(undefined);
  // const [tanggalAwal, setTanggalAwal] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedType, setSelectedType] = useState<'internal' | 'eksternal'>(typeSelected ?? 'internal');

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true)

    const session = await getSession();
    const data = new FormData(e.target);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/berkas/pks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.rsiap?.access_token}`
      },
      body: data
    });

    const result = await res.json();
    if (result.success) {
      toast.success('Data berhasil disimpan!');
      router.reload()
      setIsLoading(false)
    } else {
      console.log(result);
      setIsLoading(false)
    }
  }

  useEffect(() => {
    parseNomor();
  }, [selectedType, tglAwal, typeSelected])



  function parseNomor() {
    const no = lastNomor[selectedType];
    const nos = no?.split('/');

    const nmr = parseInt(nos?.[0] ?? '0') + 1;
    const nomor = nmr.toString().padStart(3, '0');
    const type = selectedType === 'internal' ? 'A' : 'B';

    // get tglAwal and convert to ddMMyy
    const tanggal = tglAwal.split('-').map((item, index) => {
      if (index === 0) return item.slice(2);
      return item;
    }).reverse().join('');

    const nomorPks = `${nomor}/${type}/PKS-RSIA/${tanggal}`;
    setNomorPks(nomorPks);
  }

  return (
    <form method="post" encType="multipart/form-data" onSubmit={onSubmit}>
      <div className="mb-4 space-y-1.5">
        <Label className="text-primary font-semibold" htmlFor="judul">Judul</Label>
        <Input type="text" id="judul" name="judul" placeholder="Judul / Nama berkas" />
      </div>

      <div className="mb-4 space-y-1.5 relative">
        <Label className="text-primary font-semibold" htmlFor="tipe-surat">Tipe Surat</Label>
        <RadioGroup className="flex gap-6" onValueChange={setSelectedType as any} defaultValue={selectedType}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="internal" id="r1" />
            <Label className="font-medium" htmlFor="r1">Internal Rumah Sakit</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="eksternal" id="r2" />
            <Label className="font-medium" htmlFor="r2">Antar Instansi</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-2 gap-3 gap-y-1">
        {/* tanggal awal dan akhir */}
        <div className="mb-4 space-y-1.5">
          <Label className="text-primary font-semibold" htmlFor="tanggal_awal">Tanggal Awal</Label>
          {/* get date now yyyy-MM-dd */}
          <Input type="date" id="tanggal_awal" name="tanggal_awal" placeholder="Tanggal Awal" value={tglAwal} onChange={(e) => setTglAwal(e.target.value)} />
        </div>
        <div className="mb-4 space-y-1.5">
          <Label className="text-primary font-semibold" htmlFor="tanggal_akhir">Tanggal Ahir</Label>
          <Input type="date" id="tanggal_akhir" name="tanggal_akhir" placeholder="Tanggal Ahir" />
        </div>
        {/* No Pks Intenal Dan Eksternal */}
        <div className="mb-4 space-y-1.5">
          <Label className="text-primary font-semibold" htmlFor="no_pks_internal">No. PKS Internal</Label>
          <Input type="text" id="no_pks_internal" name="no_pks_internal" placeholder="No. PKS Internal" value={nomorPks} readOnly />
        </div>
        <div className="mb-4 space-y-1.5">
          <Label className="text-primary font-semibold" htmlFor="no_pks_eksternal">No. PKS Eksternal</Label>
          <Input type="text" id="no_pks_eksternal" name="no_pks_eksternal" placeholder="No. PKS Eksternal" />
        </div>
      </div>
      <div className="mb-4 space-y-1.5">
        <Label className="text-primary font-semibold" htmlFor="pj">Penanggung Jawab</Label>
        <Input type="hidden" id="pj" name="pj" defaultValue={selected} />
        <Combobox items={[
          { label: "Kicky Eka Shelviani, M.S.M", value: "3.925.0123" },
          { label: "Nuranisa Heristiani, Amd.Keb", value: "2.318.0217" },
          { label: "Satya Putranto, S.E", value: "3.903.0916" },
          { label: "Immawan Hudayanto, ST", value: "3.901.1209" },
        ]} setSelectedItem={setSelected} selectedItem={selected} placeholder="Pilih Penanggung Jawab" />
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

export default FormAddPks