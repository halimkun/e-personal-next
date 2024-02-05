import AppLayout from "@/components/layouts/app";
import dynamic from "next/dynamic";

import { NextPageWithLayout } from "@/pages/_app";
import { ReactElement } from "react";

const FormAddMemoInternal = dynamic(() => import('@/components/custom/forms/add-memo-internal'), { ssr: false })

const MemoInternalPage: NextPageWithLayout = () => {
  return (
    <FormAddMemoInternal />
  )
}

MemoInternalPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default MemoInternalPage