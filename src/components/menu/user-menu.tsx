import { Separator } from "../ui/separator"
import { SidebarNew } from "../custom/sidebar-new"
import { useSession } from "next-auth/react"

import useSWRImmutable from 'swr/immutable';
import dynamic from 'next/dynamic'
import { cn } from "@/lib/utils";

const Loading1 = dynamic(() => import('../custom/icon-loading'), { ssr: false })

interface UserMenuProps {
  setMenu: any
  isCollapsed: boolean
}

const UserMenu = (props: UserMenuProps) => {
  const { isCollapsed, setMenu } = props
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data: session } = useSession();
  const { data, isLoading } = useSWRImmutable( // Ubah dari useSWR ke useSWRImmutable
    `${process.env.NEXT_PUBLIC_API_URL}/v2/menu-epersonal?nik=${session?.user?.sub}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // if has data then set menu
  if (data) {
    setMenu(data.data)
  }

  return isLoading ? (
    <div className="flex justify-center items-center h-full py-10">
      <Loading1 height="h-10" width="w-10" />
    </div>
  ) : (
    data && Object.keys(data.data).length > 0 ? (
      Object.keys(data.data).map((key: any, index: number) => {
        const menuItem = data.data[key]
        return (
          <>
            <p className={cn(
              'px-3 pt-3 text-sm font-semibold text-primary tracking-wide',
              isCollapsed && 'hidden'
            )}>{key}</p>
            <SidebarNew key={index} links={menuItem} isCollapsed={isCollapsed} />
            <Separator />
          </>
        )
      })
    ) : (
      <div className="flex justify-center items-center h-full py-10">
        <p className="text-muted-foreground">Tidak ada layanan untuk anda</p>
      </div>
    )
  )

}

export default UserMenu