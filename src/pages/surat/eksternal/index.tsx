import AppLayout from '@/components/layouts/app';

import { useState } from 'react';

import { useRouter } from 'next/router';
import type { ReactElement } from 'react'
import type { NextPageWithLayout } from '../../_app';

import { Button } from "@/components/ui/button"
import { IconPlus, IconTag } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const SuratInternal: NextPageWithLayout = () => {
  const route = useRouter()
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false)

  return (
    <>
      <div className='space-y-4'>
        <Card className="max-w-screen">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <CardTitle>Surat Eksternal</CardTitle>
                <CardDescription>Daftar surat eksternal RSIA Aisyiyah Pekajangan.</CardDescription>
              </div>
              <Button variant="default" size="icon" className="w-7 h-7" onClick={() => route.push('/surat/eksternal/create')}>
                <IconPlus className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>

          </CardContent>
        </Card>
      </div>



      {/* Dialog Form Create Surat Internal  */}
      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Entri Surat Eksternal baru</DialogTitle>
            <DialogDescription>Isi form dibawah ini untuk menambahkan surat eksternal baru.</DialogDescription>
          </DialogHeader>
          
        </DialogContent>
      </Dialog>
    </>
  )
};

SuratInternal.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default SuratInternal;
