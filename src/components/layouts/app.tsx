import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import type { Metadata } from 'next'
import { Menu } from '../custom/menu';
import { Sidebar } from '../custom/sidebar';

// metadata for the layout
export const metadata: Metadata = {
  title: 'Auth Layout',
  description: 'Layout for login and register pages',
}

const AppLayout = ({ children }: any) => {
  return (
    <main className={`${inter.className}`}>
      <Menu />
      <Sidebar />

      <div className="p-4 sm:ml-64">
        {children}
      </div>
    </main>
  );
};

export default AppLayout;