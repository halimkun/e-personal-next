import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast';
const inter = Inter({ subsets: ['latin'] })

const AuthLayout = ({ children }: any) => {
  return (
    <>
      <main className={`${inter.className}`}>
        {children}
      </main>

      <Toaster position='bottom-right' toastOptions={
        {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      } />
    </>
  );
};

export default AuthLayout;