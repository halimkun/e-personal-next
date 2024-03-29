'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { useRouter } from 'next/router';
import '@tabler/icons-webfont/tabler-icons.min.css';

export function SidebarNew({
  links,
  isCollapsed,
}: {
  links: any[];
  isCollapsed: boolean;
}) {
  const route = useRouter();
  const pathname = route.pathname;

  return (
    <div
      data-collapsed={isCollapsed}
      className='group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2'
    >
      <nav className='grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2'>
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={`/${link.url}`}
                  className={cn(
                    buttonVariants({
                      variant: pathname.startsWith(`/${link.url}`)
                        ? 'default'
                        : 'ghost',
                      size: 'icon',
                    }),
                    'h-9 w-9'
                  )}
                >
                  <i
                    className={`ti ti-${link.icon} h-5 w-5`}
                    style={{
                      fontSize: `18px`,
                    }}
                  ></i>
                  <span className='sr-only'>{link.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side='right' className='flex items-center gap-4'>
                {link.label}
                {link.label && (
                  <span className='ml-auto text-muted-foreground'>
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href={`/${link.url}`}
              className={cn(
                buttonVariants({
                  size: 'sm',
                  variant: pathname.startsWith(`/${link.url}`)
                    ? 'default'
                    : 'ghost',
                }),
                isCollapsed ? 'justify-center' : 'justify-start'
              )}
            >
              <i
                className={`ti ti-${link.icon} mr-2 h-5 w-5`}
                style={{
                  fontSize: `18px`,
                }}
              ></i>
              {link.label}

              {/* number on right */}
              {/* {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    link.variant === "default" &&
                    "text-background dark:text-white"
                  )}
                >
                  {link.label}
                </span>
              )} */}
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
