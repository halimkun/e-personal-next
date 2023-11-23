import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconMailStar, IconLayoutDashboard, IconUserStar, IconBooks } from '@tabler/icons-react';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {

}

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside id="default-sidebar" className="fixed top-0 left-0 z-40 pt-10 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 border-r border-border" aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-2 py-4 font-medium">
          <li className="mb-2 px-4 text-lg font-semibold tracking-tight">Dashboard</li>
          <li>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/dashboard">
                <IconLayoutDashboard className="w-5 h-5 mr-2" />
                Dashboard
              </Link>
            </Button>
          </li>
        </ul>

        <ul className="py-4 space-y-2 font-medium">
          <li className="mb-2 px-4 text-lg font-semibold tracking-tight">Surat</li>
          <li>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/surat/internal">
                <IconMailStar className="w-5 h-5 mr-2" />
                Internal
              </Link>
            </Button>
          </li>
        </ul>

        <ul className="py-4 space-y-2 font-medium">
          <li className="mb-2 px-4 text-lg font-semibold tracking-tight">Karyawan</li>
          <li>
            <Button variant="ghost" className="w-full justify-start" asChild>
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
    </aside>
  )
}