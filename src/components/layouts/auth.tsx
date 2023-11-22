import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

const AuthLayout = ({ children } : any) => {
  return (
    <main className={`${inter.className}`}>
      {children}
    </main>
  );  
};

export default AuthLayout;