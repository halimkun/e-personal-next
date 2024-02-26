import dynamic from "next/dynamic";
import { NextPageWithLayout } from "@/pages/_app";
import { ReactElement } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const FormAddSuratMasuk = dynamic(() => import('@/components/custom/forms/add-surat-masuk'), { ssr: false })
const AppLayout = dynamic(() => import('@/components/layouts/app'), { ssr: false })

const CreateSuratMasuk: NextPageWithLayout = () => {
  return (
    <div className="flex flex-col md:flex-row items-start gap-3">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Entri Data Surat Masuk</CardTitle>
          <CardDescription>Entri data surat masuk</CardDescription>
        </CardHeader>
        <CardContent>
          <FormAddSuratMasuk />
        </CardContent>
      </Card>
    </div>
  )
};

CreateSuratMasuk.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default CreateSuratMasuk;