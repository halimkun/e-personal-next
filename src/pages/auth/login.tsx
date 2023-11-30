import type { ReactElement } from 'react'
import type { NextPageWithLayout } from '../_app';
import { UserAuthForm } from '@/components/custom/forms/user-auth';
import AuthLayout from '@/components/layouts/auth';

const LoginPage: NextPageWithLayout = () => {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 dark:text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-secondary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          E - Personal
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo; Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Odio, sequi aut ipsam dolor debitis consequuntur!
              Fugit maxime fugiat repudiandae rerum.
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
          <p className="px-8 text-center text-sm text-muted-foreground">
            Made by <strong>IT Team RSIA Aisyiyah Pekajangan</strong>
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
