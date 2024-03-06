import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  IconMailStar,
  IconLayoutDashboard,
  IconUserStar,
  IconBooks,
  IconFileCertificate,
  IconMailDown,
  IconNote,
  IconVirusOff,
  IconUserHeart,
  IconBuildingHospital,
  IconStethoscope,
  IconBodyScan,
  IconUserUp,
} from '@tabler/icons-react';
import { IconMailShare } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';
import { IconFileStack } from '@tabler/icons-react';
import { IconFilePower } from '@tabler/icons-react';
import { IconWriting } from '@tabler/icons-react';
import { IconRibbonHealth } from '@tabler/icons-react';

const AppMenu = () => {
  const router = useRouter();
  const { pathname } = router;

  const sidebarMenu: any = [
    {
      dashboard: [
        {
          name: 'Dashboard',
          path: '/dashboard',
          icon: <IconLayoutDashboard className='mr-2 h-5 w-5' />,
        },
      ],
    },

    {
      surat: [
        {
          name: 'Internal',
          path: '/surat/internal',
          icon: <IconMailStar className='mr-2 h-5 w-5' />,
        },
        {
          name: 'External',
          path: '/surat/eksternal',
          icon: <IconMailShare className='mr-2 h-5 w-5' />,
        },
        {
          name: 'Surat Masuk',
          path: '/surat/masuk',
          icon: <IconMailDown className='mr-2 h-5 w-5' />,
        },
      ],
    },

    {
      berkas: [
        {
          name: 'SPO',
          path: '/berkas/spo',
          icon: <IconFileStack className='mr-2 h-5 w-5' />,
        },
        {
          name: 'Kerjasama',
          path: '/berkas/kerjasama',
          icon: <IconFileCertificate className='mr-2 h-5 w-5' />,
        },
        {
          name: 'Surat Keputusan',
          path: '/berkas/sk',
          icon: <IconFilePower className='mr-2 h-5 w-5' />,
        },
      ],
    },

    {
      'berkas komite': [
        {
          name: 'Keperawatan',
          path: '/berkas/komite/keperawatan',
          icon: <IconStethoscope className='mr-2 h-5 w-5' />,
        },
        {
          name: 'Kesehatan',
          path: '/berkas/komite/kesehatan',
          icon: <IconBuildingHospital className='mr-2 h-5 w-5' />,
        },
        {
          name: 'Medis',
          path: '/berkas/komite/medis',
          icon: <IconRibbonHealth className='mr-2 h-5 w-5' />,
        },
      ],
    },

    {
      'berkas lainnya': [
        {
          name: 'PPI',
          path: '/berkas/ppi',
          icon: <IconVirusOff className='mr-2 h-5 w-5' />,
        },
        {
          name: 'PMKP',
          path: '/berkas/pmkp',
          icon: <IconUserHeart className='mr-2 h-5 w-5' />,
        },
        {
          name: 'IHT',
          path: '/berkas/iht',
          icon: <IconUserUp className='mr-2 h-5 w-5' />,
        },
        {
          name: 'Radiologi',
          path: '/berkas/radiologi',
          icon: <IconBodyScan className='mr-2 h-5 w-5' />,
        },
      ],
    },

    {
      lainnya: [
        {
          name: 'Memo Internal',
          path: '/memo/internal',
          icon: <IconNote className='mr-2 h-5 w-5' />,
        },

        {
          name: 'Undangan & Notulen',
          path: '/berkas/notulen',
          icon: <IconWriting className='mr-2 h-5 w-5' />,
        },
      ],
    },

    {
      karyawan: [
        {
          name: 'Karyawan',
          path: '/karyawan',
          icon: <IconUserStar className='mr-2 h-5 w-5' />,
        },
      ],
    },
  ];

  return (
    <div className='h-full overflow-y-auto px-3 py-4'>
      <div className='my-4'>
        {sidebarMenu.map((menu: any) =>
          Object.keys(menu).map((key) => (
            <ul
              className='space-y-1 py-2 font-medium'
              key={key + Math.random().toString(36).substring(7)}
            >
              {/* combin with random string */}
              <li
                className='mb-2 px-4 text-xs uppercase tracking-normal text-slate-600 dark:text-slate-400'
                key={key + Math.random().toString(36).substring(7)}
              >
                {key}
              </li>
              {menu[key].map((item: any) => (
                <li key={item.path} className='ml-4'>
                  <Button
                    variant='ghost'
                    className={cn(
                      'w-full justify-start',
                      pathname.startsWith(item.path) &&
                        'bg-primary text-primary-foreground dark:bg-primary dark:text-secondary-foreground'
                    )}
                    asChild
                  >
                    <Link href={item.path}>
                      {item.icon}
                      {item.name}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          ))
        )}
      </div>
    </div>
  );
};

export default AppMenu;
