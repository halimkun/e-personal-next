import FormAddSuratMasuk from "@/components/custom/forms/add-surat-masuk";
import AppLayout from "@/components/layouts/app";

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