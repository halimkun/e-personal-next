import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, { ReactElement, useEffect, useState } from 'react';

import startOfWeek from 'date-fns/startOfWeek';
import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import id from 'date-fns/locale/id';
import parse from 'date-fns/parse';
import dynamic from 'next/dynamic';

import { NextPageWithLayout } from '../_app';
import { getSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  IconChevronLeft,
  IconChevronRight,
  IconFocus2,
} from '@tabler/icons-react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { cn } from '@/lib/utils';

const AppLayout = dynamic(() => import('@/components/layouts/app'), {
  ssr: false,
});
const DialogDetailAgenda = dynamic(
  () => import('@/components/custom/modals/dialog-detail-agenda'),
  { ssr: false }
);
const DialogAddAgenda = dynamic(
  () => import('@/components/custom/modals/dialog-add-agenda'),
  { ssr: true }
);

const locales = {
  id: id,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DashboardPage: NextPageWithLayout = () => {
  const [add, setAdd] = useState(false);
  const [evt, sEvt] = useState<any>({});
  const [events, setEvents] = useState<any>([]);
  const [tgl, setTgl] = useState(new Date());
  const [detail, setDetail] = useState(false);

  const [start, setStart] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0]
  );
  const [end, setEnd] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      .toISOString()
      .split('T')[0]
  );

  const fetcher = async (url: string) => {
    const session = await getSession();
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.rsiap?.access_token}`,
      },
    });

    const data = await res.json();
    return data.data;
  };

  useEffect(() => {
    // agenda/calendar
    fetcher(`${process.env.NEXT_PUBLIC_API_URL}/agenda/calendar`).then(
      (res) => {
        setEvents(res.agenda);
      }
    );
  }, []);

  useEffect(() => {
    // agenda/calendar
    fetcher(
      `${process.env.NEXT_PUBLIC_API_URL}/agenda/calendar?start=${start}&end=${end}`
    ).then((res) => {
      setEvents(res.agenda);
    });
  }, [start, end]);

  return (
    <>
      <div className='flex flex-col items-start gap-3 lg:flex-row'>
        <Card className='w-full lg:min-w-[70%]'>
          <CardContent className='p-3'>
            <Calendar
              handleDragStart={(e: any) => {}}
              popup={true}
              view='month'
              onView={(e: any) => {}}
              components={{
                toolbar: (e: any) => {
                  return (
                    <div className='mb-3 flex items-center justify-between'>
                      {/* today, nect, back */}
                      <div className='flex items-center gap-3'>
                        <Button
                          variant='outline'
                          size='icon'
                          onClick={() => e.onNavigate('PREV')}
                        >
                          <IconChevronLeft className='text-foreground' />
                        </Button>
                        <Button
                          variant='outline'
                          size='icon'
                          onClick={() => e.onNavigate('NEXT')}
                        >
                          <IconChevronRight className='text-foreground' />
                        </Button>
                      </div>

                      {/* title */}
                      <div className='font-semibold'>{e.label}</div>

                      <div className='flex items-center gap-3'>
                        <Button
                          variant='outline'
                          size='icon'
                          onClick={() => e.onNavigate('TODAY')}
                        >
                          <IconFocus2 className='text-foreground' />
                        </Button>
                      </div>
                    </div>
                  );
                },
                month: {
                  header: (e: any) => {
                    return <div className='py-2 text-center'>{e.label}</div>;
                  },
                  // dateHeader: (e: any) => {
                  //   return (
                  //     <div className="text-sm text-center py-2 pb-1">{e.label}</div>
                  //   )
                  // },
                  event: (e: any) => {
                    return (
                      <div className='flex flex-col gap-1'>
                        <div className='text-xs'>{e.title}</div>
                        <div className='mb-1 text-[0.7rem] leading-[0.5rem]'>
                          {new Date(
                            e.event.resource?.tanggal
                          ).toLocaleDateString('id-ID', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    );
                  },
                },
              }}
              onSelectEvent={(event: any) => {
                sEvt(event);
                setDetail(true);
              }}
              onDrillDown={(e: any) => {
                setAdd(true);
                setTgl(e);
              }}
              onRangeChange={(e: any) => {
                if (e.start && e.end) {
                  const { start, end } = e;

                  const s_ = start.toISOString().split('T')[0];
                  const e_ = end.toISOString().split('T')[0];

                  setStart(s_);
                  setEnd(e_);
                }
              }}
              events={events}
              localizer={localizer}
              style={{ height: 600 }}
            />
          </CardContent>
        </Card>
        <Card className='w-full lg:min-w-[30%]'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex flex-col gap-2'>
                <CardTitle className='text-primary'>
                  Daftar Agenda Bulanan
                </CardTitle>
                <CardDescription>
                  {new Date(start).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  -{' '}
                  {new Date(end).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='px-2 pb-2'>
            <div className='max-h-[500px] w-full overflow-y-scroll p-3'>
              {events
                .sort((a: any, b: any) => {
                  return (
                    new Date(a.resource?.tanggal).getTime() -
                    new Date(b.resource?.tanggal).getTime()
                  );
                })
                .reverse()
                .map((e: any, i: number) => {
                  return (
                    <div
                      key={i}
                      className='mb-2 flex cursor-pointer items-start gap-3 rounded-lg border border-transparent px-3 py-2 transition-all duration-200 ease-in-out hover:border-border hover:bg-white hover:shadow-md dark:hover:bg-white/10'
                      onClick={() => {
                        sEvt(e);
                        setDetail(true);
                      }}
                    >
                      <div className='w-auto'>
                        <div
                          className={cn(
                            'mt-[0.3rem] h-4 w-4 rounded-full',
                            e.resource?.status === 'disetujui'
                              ? 'bg-success'
                              : e.resource?.status === 'ditolak'
                                ? 'bg-danger'
                                : 'bg-warning'
                          )}
                        ></div>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <div className='text-base font-bold'>{e.title}</div>
                        <div className='text-xs text-gray-600 dark:text-gray-500'>
                          {e.resource?.tempat}
                        </div>
                        <div className='text-xs text-gray-600 dark:text-gray-500'>
                          {new Date(e.resource?.tanggal).toLocaleDateString(
                            'id-ID',
                            {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      <DialogDetailAgenda
        evt={evt}
        setEvt={sEvt}
        detail={detail}
        setDetail={setDetail}
        setEdit={setAdd}
      />

      <DialogAddAgenda
        evt={evt}
        setEvt={sEvt}
        add={add}
        setAdd={setAdd}
        tanggal={tgl}
      />
    </>
  );
};

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
export default DashboardPage;
