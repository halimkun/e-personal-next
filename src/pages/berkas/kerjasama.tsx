import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import AppLayout from "@/components/layouts/app";

const BerkasKerjasama: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Berkas Kerjasama</h1>
    </div>
  );
}

BerkasKerjasama.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default BerkasKerjasama;