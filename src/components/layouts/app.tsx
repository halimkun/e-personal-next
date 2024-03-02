import React, { useEffect } from 'react'
import type { Metadata } from 'next'

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

import { cn } from '@/lib/utils'
import { Separator } from '../ui/separator'
import { isMobile } from 'react-device-detect'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { AppMenuProvider } from '@/components/menu-context'

import { ScrollArea } from '../ui/scroll-area'
import { useSession } from "next-auth/react"
import { ModeToggle } from '../custom/mode-toggle'
import { LogoutButton } from '../custom/buttons/logout'
import { useAppMenu } from '../menu-context'
import dynamic from 'next/dynamic'

const UserMenu = dynamic(() => import('../menu/user-menu'), { ssr: false })

export const metadata: Metadata = {
  title: 'Auth Layout',
  description: 'Layout for login and register pages',
}

const AppLayout = ({ children }: any) => {
  const { data: session, status } = useSession()
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  useEffect(() => {
    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
      isMobile ? true : isCollapsed
    )}`
  }, [isCollapsed])

  useEffect(() => {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(
      true
    )}`
  }, [isMobile])

  return (
    <main className={`${inter.className}`}>
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={(sizes: number[]) => {
            document.cookie = `react-resizable-panels:layout=${JSON.stringify(
              sizes
            )}`
          }}
          className="h-full max-h-screen items-stretch"
        >
          <ResizablePanel
            defaultSize={180}
            collapsedSize={4}
            collapsible={true}
            minSize={15}
            maxSize={20}
            onCollapse={(collapsed: void) => setIsCollapsed(true)}
            onExpand={(expanded: void) => setIsCollapsed(false)}
            className={cn(isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out")}
          >
            <div className={cn("flex flex-col h-[80px] items-center justify-between p-3", isCollapsed ? 'h-[80px]' : 'p-3')}>
              <div>Login Sebagai : <span className="font-semibold">{session?.user?.name}</span></div>

              <div className="flex items-center justify-center gap-2">
                <ModeToggle /> <LogoutButton className='h-7 w-7' />
              </div>

            </div>
            <Separator />
            <ScrollArea className="w-full pr-2 h-[calc(100vh-80px)]">
              <UserMenu isCollapsed={isCollapsed} />
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={80}>
            <ScrollArea className="h-screen w-full p-4">
              {children}
              {/* <div className="w-full flex justify-end mt-3">
                <span className="text-xs text-slate-600 dark:text-slate-400">v{version}</span>
              </div> */}
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </main>
  );
};

export default AppLayout;