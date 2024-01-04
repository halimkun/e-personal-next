import type { ReactElement } from 'react'
import type { NextPageWithLayout } from '../_app';
import { UserAuthForm } from '@/components/custom/forms/user-auth';
import AuthLayout from '@/components/layouts/auth';
import Image from 'next/image';

const LoginPage: NextPageWithLayout = () => {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 dark:text-muted dark:border-r lg:flex">
        <div className="absolute inset-0 bg-secondary" />
        <div className="relative z-20 flex items-center text-lg font-medium gap-3">
          <Image src="/static/logo.png" width={28} height={28} alt="Logo RSIA Permata Hati" />
          E - Personal
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo; Sehat dan bahagia bersama kami <br />
              <span className="ml-3"><strong>RSIA Aisyiyah Pekajangan</strong> &rdquo;</span>
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Logi to your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to continue
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground/50">
            IT Team RSIA Aisyiyah Pekajangan
          </p>
        </div>
      </div>
    </div>
  );
};

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthLayout>{page}</AuthLayout>
  )
}

export default LoginPage;
