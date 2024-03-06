import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import type { Metadata } from 'next';
import { Menu } from '@/components/custom/menu';
import { Sidebar } from '@/components/custom/sidebar';
import { Toaster } from 'react-hot-toast';

// metadata for the layout
export const metadata: Metadata = {
  title: 'Auth Layout',
  description: 'Layout for login and register pages',
};

const AppLayout = ({ children }: any) => {
  return (
    <main className={`${inter.className}`}>
      <Menu />
      <Sidebar />

      <div className='p-4 lg:ml-64'>{children}</div>

      <Toaster
        position='bottom-right'
        toastOptions={{
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </main>
  );
};

export default AppLayout;
