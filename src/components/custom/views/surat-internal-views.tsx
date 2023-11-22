"use client";

import { useState } from 'react';
import { getDate, getTime } from '@/lib/date';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog"
import { IconPlus } from "@tabler/icons-react"
import FormAddSuratInternal from "@/components/custom/forms/add-surat-internal"

interface SuratInternalProps {
  data: any[];
}

export default function SuratInternalView({ data }: SuratInternalProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Card className="max-w-screen">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <CardTitle>Surat Internal</CardTitle>
              <CardDescription>Daftar surat internal yang telah dibuat.</CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="icon" className="w-7 h-7"><IconPlus className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" /></Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle><strong className="text-lg">Tambah Surat Internal</strong></DialogTitle>
                  <DialogDescription>
                    Tambahkan surat internal baru sebagai history surat internal yang telah dibuat.
                  </DialogDescription>
                </DialogHeader>
                <FormAddSuratInternal setOpen={setOpen} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomor</TableHead>
                <TableHead>PJ</TableHead>
                <TableHead>Perihal</TableHead>
                <TableHead>Tempat</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((d: any) => (
                <TableRow key={d.no_surat} className="group">
                  <TableCell className="md:whitespace-nowrap">
                    <Badge variant="default">{d.no_surat}</Badge>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider delayDuration={50}>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="outline" className="cursor-pointer group-hover:border-primary">
                            {d.pj}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>{d.pj_detail.nama}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    {d.perihal.length > 50 ? d.perihal.substring(0, 80) + ' . . .' : d.perihal}
                  </TableCell>
                  <TableCell>{d.tempat}</TableCell>
                  <TableCell className="text-right">
                    <div className="md:whitespace-nowrap">{getDate(d.tanggal)}</div>
                    <div className="md:whitespace-nowrap">{getTime(d.tanggal)}</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}