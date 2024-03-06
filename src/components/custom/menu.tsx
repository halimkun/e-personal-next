'use client';

import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

import { Menubar, MenubarMenu } from '@/components/ui/menubar';
import { ModeToggle } from './mode-toggle';
import { OffCanvasMenu } from './off-canvas-menu';
import { Button } from '@/components/ui/button';
import { IconLogout } from '@tabler/icons-react';
import { getSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export function Menu() {
  const router = useRouter();
  const handleSignOut = async () => {
    const sesstion = await getSession();
    const confirm = window.confirm('Are you sure you want to log out?');

    if (confirm) {
      // unauthenticate user from api
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sesstion?.rsiap?.access_token}`,
          },
        }
      );

      const data = await res.json();
      if (data?.success) {
        // unauthenticate user from next-auth
        await signOut();
        toast.success(data?.message);

        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        toast.error(data?.message);
      }
    }
  };

  return (
    <Menubar className='sticky top-0 z-[11] w-full rounded-none border-0 border-b-[1px] border-border bg-background px-4 py-7 lg:px-6'>
      <div className='flex w-full items-center justify-between'>
        <div className='left-menu align-center flex items-center gap-4'>
          <OffCanvasMenu />

          <MenubarMenu>
            <Link
              className='flex items-center justify-center gap-2 text-lg font-bold tracking-wide text-primary'
              href='/dashboard'
            >
              <Image
                src='/images/logo.png'
                width={32}
                height={32}
                alt='Logo RSIA Permata Hati'
              />
              <span className='text-2xl'>E - Personal</span>
            </Link>
          </MenubarMenu>
        </div>

        <div className='right-menu'>
          <div className='flex items-center gap-1'>
            <ModeToggle />

            <Button
              variant={'ghost'}
              size={'icon'}
              title='Log out from your account'
              className='text-danger'
              onClick={handleSignOut}
            >
              <IconLogout className='h-5 w-5' />
            </Button>
          </div>
        </div>
      </div>
    </Menubar>
  );
}
