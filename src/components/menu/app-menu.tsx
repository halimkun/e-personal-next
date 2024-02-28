import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconMailStar, IconLayoutDashboard, IconUserStar, IconBooks, IconFileCertificate, IconMailDown, IconNote, IconVirusOff, IconUserHeart, IconBuildingHospital, IconStethoscope, IconBodyScan, IconUserUp } from '@tabler/icons-react';
import { IconMailShare } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import { IconFileStack } from "@tabler/icons-react";
import { IconFilePower } from "@tabler/icons-react";
import { IconWriting } from "@tabler/icons-react";
import { IconRibbonHealth } from "@tabler/icons-react";

const AppMenu = () => {
  const router = useRouter();
  const { pathname } = router;

  const sidebarMenu: any = [
    {
      "dashboard": [
        {
          "name": "Dashboard",
          "path": "/dashboard",
          "icon": <IconLayoutDashboard className="w-5 h-5 mr-2" />,
        }
      ],
    },

    {
      "surat": [
        {
          "name": "Internal",
          "path": "/surat/internal",
          "icon": <IconMailStar className="w-5 h-5 mr-2" />,
        },
        {
          "name": "External",
          "path": "/surat/eksternal",
          "icon": <IconMailShare className="w-5 h-5 mr-2" />,
        },
        {
          "name": "Surat Masuk",
          "path": "/surat/masuk",
          "icon": <IconMailDown className="w-5 h-5 mr-2" />,
        }
      ],
    },

    {
      "berkas": [
        {
          "name": "SPO",
          "path": "/berkas/spo",
          "icon": <IconFileStack className="w-5 h-5 mr-2" />,
        },
        {
          "name": "Kerjasama",
          "path": "/berkas/kerjasama",
          "icon": <IconFileCertificate className="w-5 h-5 mr-2" />,
        },
        {
          "name": "Surat Keputusan",
          "path": "/berkas/sk",
          "icon": <IconFilePower className="w-5 h-5 mr-2" />,
        }
      ],
    },

    {
      "berkas komite": [
        {
          "name": "Keperawatan",
          "path": "/berkas/komite/keperawatan",
          "icon": <IconStethoscope className="w-5 h-5 mr-2" />,
        },
        {
          "name": "Kesehatan",
          "path": "/berkas/komite/kesehatan",
          "icon": <IconBuildingHospital className="w-5 h-5 mr-2" />,
        },
        {
          "name": "Medis",
          "path": "/berkas/komite/medis",
          "icon": <IconRibbonHealth className="w-5 h-5 mr-2" />,
        },
      ],
    },

    {
      "berkas lainnya": [
        {
          "name": "PPI",
          "path": "/berkas/ppi",
          "icon": <IconVirusOff className="w-5 h-5 mr-2" />,
        },
        {
          "name": "PMKP",
          "path": "/berkas/pmkp",
          "icon": <IconUserHeart className="w-5 h-5 mr-2" />,
        },
        {
          "name": "IHT",
          "path": "/berkas/iht",
          "icon": <IconUserUp className="w-5 h-5 mr-2" />,
        },
        {
          "name": "Radiologi",
          "path": "/berkas/radiologi",
          "icon": <IconBodyScan className="w-5 h-5 mr-2" />,
        },
      ],
    },

    {
      "lainnya" : [
        {
          "name": "Memo Internal",
          "path": "/memo/internal",
          "icon": <IconNote className="w-5 h-5 mr-2" />,
        },

        {
          "name": "Undangan & Notulen",
          "path": "/berkas/notulen",
          "icon": <IconWriting className="w-5 h-5 mr-2" />,
        }
      ]
    },

    {
      "karyawan": [
        {
          "name": "Karyawan",
          "path": "/karyawan",
          "icon": <IconUserStar className="w-5 h-5 mr-2" />,
        }
      ]
    }
  ]

  return (
    <div className="h-full px-3 py-4 overflow-y-auto">

      <div className="my-4">
        {sidebarMenu.map((menu: any) => (
          Object.keys(menu).map((key) => (
            <ul className="space-y-1 py-2 font-medium" key={key + Math.random().toString(36).substring(7)}>
              {/* combin with random string */}
              <li className="mb-2 px-4 text-xs tracking-normal uppercase text-slate-600 dark:text-slate-400" key={key + Math.random().toString(36).substring(7)}>{key}</li>
              {menu[key].map((item: any) => (
                <li key={item.path} className="ml-4">
                  <Button variant="ghost" className={cn(
                    'w-full justify-start',
                    pathname.startsWith(item.path) && 'bg-primary text-primary-foreground dark:bg-primary dark:text-secondary-foreground'
                  )} asChild>
                    <Link href={item.path}>
                      {item.icon}
                      {item.name}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          ))
        ))}
      </div>
    </div>
  );
}

export default AppMenu;