import { Separator } from "../ui/separator"
import { SidebarNew } from "../custom/sidebar-new"
import { useSession } from "next-auth/react"

import useSWRImmutable from 'swr/immutable';
import dynamic from 'next/dynamic'
import useSWR from "swr"

const Loading1 = dynamic(() => import('../custom/icon-loading'), { ssr: false })

interface UserMenuProps {
  isCollapsed: boolean
}

const UserMenu = (props: UserMenuProps) => {
  const { isCollapsed } = props

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data: session } = useSession();
  const { data, isLoading } = useSWRImmutable( // Ubah dari useSWR ke useSWRImmutable
    `${process.env.NEXT_PUBLIC_API_URL}/v2/menu-epersonal?dep=${session?.user?.dep}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return isLoading ? (
    <div className="flex justify-center items-center h-full py-10">
      <Loading1 height="h-10" width="w-10" />
    </div>
  ) : (
    Object.keys(data.data).length > 0 ? (
      Object.keys(data.data).map((key: any, index: number) => {
        const menuItem = data.data[key]
        return (
          <>
            <p className="px-3 pt-3 text-sm font-semibold text-primary tracking-wide">{key}</p>
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