import React, { ReactElement, useEffect, useState } from 'react';
import { NextPageWithLayout } from '../_app';
import AppLayout from '@/components/layouts/app';
import { getSession } from 'next-auth/react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useSWR from 'swr';
import { IconLoader } from '@tabler/icons-react';


const DashboardPage: NextPageWithLayout = () => {
  const [events, setEvents] = useState([])

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

    fetcher('https://sim.rsiaaisyiyah.com/rsiap-api/api/surat/internal/get/calendar').then(data => {
      setEvents(data)
    }).catch(err => console.log(err))
  }, [])

  return (
    <>
      <div className='flex gap-3'>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <CardTitle className="text-success">Disetujui</CardTitle>
                <CardDescription>Surat internal diseujui.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque nulla recusandae debitis consequatur reiciendis molestias, architecto distinctio, eaque, incidunt earum laborum ipsa quos ipsam culpa voluptatum doloribus amet tempore. Adipisci.
          </CardContent>
        </Card>
        <Card className="min-w-[60%]">
          <CardContent className='p-3'>
            <FullCalendar
              plugins={[dayGridPlugin, listPlugin]}
              initialView="dayGridMonth"
              titleFormat={{ year: 'numeric', month: 'long' }}
              headerToolbar={{
                left: 'title',
                right: 'dayGridMonth,listMonth'
              }}
              footerToolbar={{
                left: 'prev,next',
                right: 'today'
              }}
              events={events}
            />
          </CardContent>
        </Card>
      </div>
    </>
  )
};

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default DashboardPage;
