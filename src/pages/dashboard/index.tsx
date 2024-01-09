import 'react-big-calendar/lib/css/react-big-calendar.css';

import React, { ReactElement, useEffect, useState } from 'react';
import AppLayout from '@/components/layouts/app';

import { NextPageWithLayout } from '../_app';
import { getSession, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconChevronLeft, IconChevronRight, IconFocus2 } from '@tabler/icons-react';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import id from 'date-fns/locale/id'
import { cn } from '@/lib/utils';

const locales = {
  'id': id,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const DashboardPage: NextPageWithLayout = () => {
  const { data } = useSession();
  const [evt, sEvt] = useState<any>({})
  const [events, setEvents] = useState([])
  const [detail, setDetail] = useState(false)

  const [start, setStart] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0])
  const [end, setEnd] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0])

  useEffect(() => {
    const fetcher = async (url: string) => {
      const session = await getSession();
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.rsiap?.access_token}`
        }
      });

      const data = await res.json();
      return data.data;
    }

    fetcher(`${process.env.NEXT_PUBLIC_API_URL}/surat/internal/get/calendar`).then(data => {
      const nd = data.map((e: any) => {
        return {
          title: e.title,
          start: e.date,
          end: e.date,
          resource: {
            no_surat: e.no_surat,
            pj: e.pj,
            pj_detail: e.pj_detail,
            tempat: e.tempat,
            tanggal: e.tanggal,
            status: e.status
          }
        }
      })

      setEvents(nd)
    }).catch(err => console.log(err))
  }, [])

  useEffect(() => {
    async function fetchEvent() {
      setEvents([])
      const session = await getSession();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/surat/internal/get/calendar?start=${start}&end=${end}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.rsiap?.access_token}`
        }
      });

      const data = await res.json();
      const nd = data.data.map((e: any) => {
        return {
          title: e.title,
          start: e.date,
          end: e.date,
          resource: {
            no_surat: e.no_surat,
            pj: e.pj,
            pj_detail: e.pj_detail,
            tempat: e.tempat,
            tanggal: e.tanggal,
            status: e.status
          }
        }
      })

      setEvents(nd)
    }

    fetchEvent()
  }, [start, end])

  return (
    <>
      <div className='flex flex-col lg:flex-row items-start gap-3'>
        <Card className="w-full lg:min-w-[70%]">
          <CardContent className='p-3'>
            <Calendar
              handleDragStart={(e: any) => { }}
              popup={true}
              view='month'
              onView={(e: any) => { }}
              components={{
                toolbar: (e: any) => {
                  return (
                    <div className="flex items-center justify-between mb-3">
                      {/* today, nect, back */}
                      <div className="flex items-center gap-3">
                        <Button variant='outline' size='icon' onClick={() => e.onNavigate('PREV')}><IconChevronLeft className='text-foreground' /></Button>
                        <Button variant='outline' size='icon' onClick={() => e.onNavigate('NEXT')}><IconChevronRight className='text-foreground' /></Button>
                      </div>

                      {/* title */}
                      <div className='font-semibold'>{e.label}</div>

                      <div className="flex items-center gap-3">
                        <Button variant='outline' size='icon' onClick={() => e.onNavigate('TODAY')}><IconFocus2 className='text-foreground' /></Button>
                      </div>
                    </div>
                  )
                },
                month: {
                  header: (e: any) => {
                    return (
                      <div className="text-center py-2">{e.label}</div>
                    )
                  },
                  dateHeader: (e: any) => {
                    return (
                      <div className="text-sm text-center py-2 pb-1">{e.label}</div>
                    )
                  },
                  event: (e: any) => {
                    return (
                      <div className="flex flex-col gap-1">
                        <div className="text-xs">{e.title}</div>
                        <div className="mb-1 text-[0.7rem] leading-[0.5rem] text-primary-foreground/80">
                          {
                            new Date(e.event.resource?.tanggal).toLocaleDateString('id-ID', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          }
                        </div>
                      </div>
                    )
                  },
                },
              }}
              onDoubleClickEvent={(event: any) => {
                sEvt(event)
                setDetail(true)
              }}
              onRangeChange={(e: any) => {
                const { start, end } = e;

                const s_ = start.toISOString().split('T')[0]
                const e_ = end.toISOString().split('T')[0]

                setStart(s_)
                setEnd(e_)
              }}
              events={events}
              localizer={localizer}
              style={{ height: 600 }}
            />
          </CardContent>
        </Card>
        <Card className='w-full lg:min-w-[30%]'>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <CardTitle className='text-primary'>Daftar Agenda Bulanan</CardTitle>
                <CardDescription>{new Date(start).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} - {new Date(end).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='px-2 pb-2'>
            <div className='w-full max-h-[500px] overflow-y-scroll p-3'>
              {events.sort((a: any, b: any) => {
                return new Date(a.resource?.tanggal).getTime() - new Date(b.resource?.tanggal).getTime()
              }).reverse().map((e: any, i: number) => {
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 mb-2 border border-transparent px-3 py-2 hover:border-border hover:bg-white dark:hover:bg-white/10 hover:shadow-md rounded-lg duration-200 transition-all ease-in-out cursor-pointer"
                    onClick={() => {
                      sEvt(e)
                      setDetail(true)
                    }}
                  >
                    <div className="w-auto">
                      <div className={cn(
                        'mt-[0.3rem] h-4 w-4 rounded-full',
                        e.resource?.status === 'disetujui' ? 'bg-success' : (e.resource?.status === 'ditolak' ? 'bg-danger' : 'bg-warning')

                      )}></div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-base font-bold">{e.title}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-500">{e.resource?.tempat}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-500">{new Date(e.resource?.tanggal).toLocaleDateString('id-ID', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={detail} onOpenChange={setDetail}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-primary leading-6'>{evt.title}</DialogTitle>
            <DialogHeader><span className="text-sm text-gray-600 dark:text-gray-500">{evt.resource?.no_surat}</span></DialogHeader>
          </DialogHeader>

          <table className="table w-full text-left">
            <tr>
              <th>Penanggung Jawab</th>
              <th>:</th>
              <td>{evt.resource?.pj_detail ? evt.resource?.pj_detail.nama : evt.resource?.pj}</td>
            </tr>
            <tr>
              <th>Tempat</th>
              <th>:</th>
              <td>{evt.resource?.tempat}</td>
            </tr>
            <tr>
              <th>Tanggal</th>
              <th>:</th>
              <td>{new Date(evt.resource?.tanggal).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} - {new Date(evt.resource?.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</td>
            </tr>
            <tr>
              <th>Status</th>
              <th>:</th>
              <td>{evt.resource?.status}</td>
            </tr>
          </table>
        </DialogContent>
      </Dialog>
    </>
  )
};

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default DashboardPage;
