import type { ReactElement } from 'react'
import type { NextPageWithLayout } from '../_app';

import AppLayout from '@/components/layouts/app';
import FormAddSuratInternal from "@/components/custom/forms/add-surat-internal"
import TabelSuratInternal from "@/components/custom/tables/surat-internal"

import { useState } from 'react';
import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const SuratInternal: NextPageWithLayout = ({ data }: any) => {
  const [open, setOpen] = useState(false)
  
  return (
    <Card className="max-w-screen">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>Surat Internal</CardTitle>
            <CardDescription>Daftar surat internal yang telah dibuat.</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="icon" className="w-7 h-7"><IconPlus className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
              <DialogHeader>
                <DialogTitle><strong className="text-lg">Tambah Surat Internal</strong></DialogTitle>
                <DialogDescription>
                  Tambahkan surat internal baru sebagai history surat internal yang telah dibuat.
                </DialogDescription>
              </DialogHeader>
              <FormAddSuratInternal setOpen={setOpen} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <TabelSuratInternal data={data} />
      </CardContent>
    </Card>
  )
};

export async function getServerSideProps(context: { req: any; res: any; }) {
  const token = context.req.cookies.access_token || '';
  const res = await fetch(`https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/surat/internal`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();

  return {
    props: {
      data: data.data
    }
  }
}

SuratInternal.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default SuratInternal;
