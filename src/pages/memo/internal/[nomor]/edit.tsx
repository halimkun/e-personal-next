import dynamic from "next/dynamic";
import AppLayout from "@/components/layouts/app";

import { ReactElement } from "react";
import { NextPageWithLayout } from "@/pages/_app";
import { getSession } from "next-auth/react";


const FormAddMemoInternal = dynamic(() => import('@/components/custom/forms/add-memo-internal'), { ssr: false })

const EditMemoInternal: NextPageWithLayout = (props: any) => {
  const { data, nomorSurat } = props
  
  return data.success ? (
    <FormAddMemoInternal
      data={data.data}
    />
  ) : (
    <div className="w-fit bg-warning/90 p-5 rounded-lg dark:bg-warning/60">
      <h1 className="text-lg font-bold">Data tidak ditemukan</h1>
      <p className="text-base">Data memo internal dengan nomor surat <span className="font-bold">{nomorSurat}</span> tidak ditemukan</p>
    </div>
  )
}

EditMemoInternal.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export async function getServerSideProps(ctx: any) {
  const { nomor } = ctx.query
  const session = await getSession(ctx)

  const nomorSurat = nomor.replaceAll(/--/g, '/')

  // berkas/memo/internal/nomor/show
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/berkas/memo/internal/${nomor}/show`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.rsiap?.access_token}`,
    },
  }).then(res => res.json())

  return {
    props: {
      data: response,
      nomorSurat: nomorSurat
    }
  }
}

export default EditMemoInternal