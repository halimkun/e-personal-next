import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/router"
import { getCookie } from "cookies-next"

const UpdateStatusSuratInternal = ({ nomor_surat, status, setStatus }: { nomor_surat: string, status: string, setStatus: any }) => {
  const route = useRouter()
  return (
    <>
      <RadioGroup defaultValue={status} onValueChange={(value) => { setStatus(value) }} className='mt-4'>
        <div className="flex justify-evenly">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pengajuan" id="r3" className='text-yellow-500 border-yellow-500 outline-yellow-500' />
            <Label htmlFor="r3">Pengajuan</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="disetujui" id="r1" className='text-green-500 border-green-500 outline-green-500' />
            <Label htmlFor="r1">Setujui</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ditolak" id="r2" className='text-red-500 border-red-500 outline-red-500' />
            <Label htmlFor="r2">tolak / batal</Label>
          </div>
        </div>
      </RadioGroup>

      {/* simpan button */}
      <div className="mt-4 flex justify-end space-x-2">
        <Button onClick={async () => {
          const res = await fetch(`https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/surat/internal/update`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getCookie('access_token')}`,
            },
            body: JSON.stringify({
              no_surat: nomor_surat,
              status: status
            })
          });

          const data = await res.json();
          if (data.success) {
            route.reload()
          }
        }} size="sm">SIMPAN</Button>
      </div>
    </>
  )
}

export default UpdateStatusSuratInternal