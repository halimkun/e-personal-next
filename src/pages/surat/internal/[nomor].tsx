import AppLayout from "@/components/layouts/app"
import { NextPageWithLayout } from "@/pages/_app"
import { useRouter } from "next/router"
import { ReactElement } from "react"

const DetailSuratInternal: NextPageWithLayout = () => {
  const router = useRouter()
  const { nomor } = router.query
  const realNomor = nomor?.toString().replace(/-/g, '/')
  

  return (
    <div>
      {realNomor}
    </div>
  )
}

DetailSuratInternal.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}
export default DetailSuratInternal