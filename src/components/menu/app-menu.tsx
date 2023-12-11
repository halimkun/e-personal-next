import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconMailStar, IconLayoutDashboard, IconUserStar, IconBooks, IconFileCertificate } from '@tabler/icons-react';
import { IconMailShare } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import { IconFileStack } from "@tabler/icons-react";

const AppMenu = () => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <div className="h-full px-3 py-4 overflow-y-auto">
      <ul className="space-y-2 py-4 font-medium">
        <li className="mb-2 px-4 text-lg font-semibold tracking-tight">Dashboard</li>
        <li>
          <Button variant="ghost" className={cn(
            'w-full justify-start',
            pathname.startsWith('/dashboard') && 'bg-primary text-primary-foreground'
          )} asChild>
            <Link href="/dashboard">
              <IconLayoutDashboard className="w-5 h-5 mr-2" />
              Dashboard
            </Link>
          </Button>
        </li>
      </ul>

      <ul className="py-4 space-y-2 font-medium">
        <li className="mb-2 px-4 text-lg font-semibold tracking-tight">Surat & Berkas</li>
        <li>
          <Button variant="ghost" className={cn(
            'w-full justify-start',
            pathname.startsWith('/surat/internal') && 'bg-primary text-primary-foreground'
          )} asChild>
            <Link href="/surat/internal">
              <IconMailStar className="w-5 h-5 mr-2" />
              Internal
            </Link>
          </Button>
        </li>
        <li>
          <Button variant="ghost" className={cn(
            'w-full justify-start',
            pathname.startsWith('/surat/eksternal') && 'bg-primary text-primary-foreground'
          )} asChild>
            <Link href="/surat/eksternal">
              <IconMailShare className="w-5 h-5 mr-2" />
              External
            </Link>
          </Button>
        </li>
        <li>
          <Button variant="ghost" className={cn(
            'w-full justify-start',
            pathname.startsWith('/berkas/spo') && 'bg-primary text-primary-foreground'
          )} asChild>
            <Link href="/berkas/spo">
              <IconFileStack className="w-5 h-5 mr-2" />
              SPO
            </Link>
          </Button>
        </li>
        <li>
          <Button variant="ghost" className={cn(
            'w-full justify-start',
            pathname.startsWith('/berkas/kerjasama') && 'bg-primary text-primary-foreground'
          )} asChild>
            <Link href="/berkas/kerjasama">
              <IconFileCertificate className="w-5 h-5 mr-2" />
              Kerjasama
            </Link>
          </Button>
        </li>
      </ul>

      <ul className="py-4 space-y-2 font-medium">
        <li className="mb-2 px-4 text-lg font-semibold tracking-tight">Karyawan</li>
        <li>
          <Button variant="ghost" className={cn(
            'w-full justify-start',
            pathname.startsWith('/karyawan') && 'bg-primary text-primary-foreground'
          )} asChild>
            <Link href="/karyawan">
              <IconUserStar className="w-5 h-5 mr-2" />
              Karyawan
            </Link>
          </Button>
        </li>
        {/* <li>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/karyawan/berkas">
                <IconBooks className="w-5 h-5 mr-2" />
                Berkas Karyawan
              </Link>
            </Button>
          </li> */}
      </ul>
    </div>
  );
}

export default AppMenu;