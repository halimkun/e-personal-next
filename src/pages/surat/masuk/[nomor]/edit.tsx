import FormAddSuratMasuk from "@/components/custom/forms/add-surat-masuk";
import AppLayout from "@/components/layouts/app";
import dynamic from "next/dynamic";

import { NextPageWithLayout } from "@/pages/_app";
import { getSession } from "next-auth/react";
import { ReactElement, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconCheck, IconSearch, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

const DialogPreviewSuratMasuk = dynamic(() => import('@/components/custom/modals/dialog-preview-surat-masuk'), { ssr: false })

const EditSuratMasuk: NextPageWithLayout = ({ data }: any) => {
  const [hasBerkas, setHasBerkas] = useState(false)
  const [isOpenPreview, setIsOpenPreview] = useState(false)

  useEffect(() => {
    if (data.data.berkas) {
      setHasBerkas(true)
    }
  }, [data])

  return (
    <div className="flex w-full flex-col md:flex-row gap-3 items-start">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-primary">Edit Data Surat Masuk</CardTitle>
          <CardDescription>Edit surat masuk dengan perihal : {data.data.perihal}</CardDescription>
        </CardHeader>
        <CardContent>
          <FormAddSuratMasuk
            data={data.data}
          />
        </CardContent>
      </Card>

      <Card className="w-full md:w-[45%] top-16 sticky">
        <CardHeader>
          <CardTitle className="text-primary">Informasi</CardTitle>
          <CardDescription>Informasi berikut berkaitan dengan surat saat ini.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <strong>Berkas Diupload</strong>
              <div className="flex gap-3">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full ${hasBerkas ? 'bg-green-400' : 'bg-red-400'}`}>
                  {hasBerkas ? <IconCheck className="w-4 h-4 text-white" stroke={2} /> : <IconX className="w-4 h-4 text-white" stroke={2} />}
                </div>

                {/* button Preview Berkas */}
                {hasBerkas && (
                  <>
                    <Button className="bg-primary text-white w-6 h-6 rounded-full" size={'icon'} onClick={() => setIsOpenPreview(true)}>
                      <IconSearch className="w-4 h-4" stroke={2} />
                    </Button>

                    <DialogPreviewSuratMasuk
                      isOpenPreview={isOpenPreview}
                      setIsOpenPreview={setIsOpenPreview}
                      selectedItem={data.data}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
};

EditSuratMasuk.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export async function getServerSideProps(context: any) {
  const { nomor } = context.query;
  const session = await getSession(context);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/surat/masuk/detail/${nomor}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.rsiap?.access_token}`,
    },
  })

  if (!response.ok) {
    throw new Error(response.status + ' ' + response.statusText)
  }

  const data = await response.json()

  return {
    props: {
      data: data
    },
  };
}

export default EditSuratMasuk;