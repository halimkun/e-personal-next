import '@/styles/globals.css'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { useTheme } from 'next-themes'
import { AuthProvider } from '@/context/auth-context'
import { ThemeProvider } from '@/components/theme-provider'
import NextNProgress from 'nextjs-progressbar';


export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <AuthProvider>
        <NextNProgress />
        {getLayout(<Component {...pageProps} />)}
      </AuthProvider>
    </ThemeProvider>
  )
}

