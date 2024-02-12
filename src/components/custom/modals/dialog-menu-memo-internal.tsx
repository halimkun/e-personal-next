import React, { useEffect } from 'react';
import he from 'he';

import { getDate } from '@/lib/date';
import { Badge } from "@/components/ui/badge"
import { Separator } from '@/components/ui/separator';
import { IconCalendar, IconKey, IconUserCircle, IconUserShield } from '@tabler/icons-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DialogMenuMemoInternalProps {
  item: any;
  additionalItem?: any;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

function decodedHTML(htmlString: string): string | null {
  if (htmlString) {
    return he.decode(htmlString)
  }

  return null
}

const DialogMenuMemoInternal = (props: DialogMenuMemoInternalProps) => {
  const { item } = props;
  const [mengetahui, setMengetahui] = React.useState<any>({});
  const [penerima, setPenerima] = React.useState<any>({});

  useEffect(() => {
    if (props.additionalItem.success) {
      setMengetahui(props.additionalItem.data.mengetahui);
      setPenerima(props.additionalItem.data.penerima);
    }
  }, [props.additionalItem]);

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='mb-2'>{item.perihal?.perihal}</DialogTitle>
          <DialogDescription>
            <div className="flex items-start justify-start flex-wrap gap-1">
              <Badge className='flex items-center justify-center gap-1' title='Penanggung Jawab'>
                <IconUserShield size={16} strokeWidth={2} /> {item.perihal?.pj_detail?.nama ?? ""}
              </Badge>
              <Badge className='flex items-center justify-center gap-1' title='Dari'>
                <IconUserCircle size={16} strokeWidth={2} /> {item.dari}
              </Badge>
              <Badge className='flex items-center justify-center gap-1' title='Nomor Surat'>
                <IconKey size={16} strokeWidth={2} /> {item.no_surat}
              </Badge>
              <Badge className='flex items-center justify-center gap-1' title='Tanggal Terbit'>
                <IconCalendar size={16} strokeWidth={2} /> {getDate(item.perihal?.tgl_terbit)}
              </Badge>
            </div>
            
            <div className="flex items-start justify-start gap-1 mt-4">
              {/* loop additionalItem.mengetahui */}
              {mengetahui && mengetahui.length > 0 && mengetahui.map((item: any, index: number) => (
                <Badge variant='success' key={index} className='flex items-center justify-center gap-1' title='mengetahui'>
                  <IconUserCircle size={16} strokeWidth={2} /> {item.nama}
                </Badge>
              ))}
              {/* loop additionalItem.penerima */}
            </div>
          </DialogDescription>
        </DialogHeader>
        <Separator className='mt-2' />
        <div dangerouslySetInnerHTML={{ __html: decodedHTML(item.content) || '' }} />
        <Separator className='mt-2' />
        {/* looop penerima */}
        <div className="flex items-start justify-start flex-wrap gap-1">
          {penerima && penerima.length > 0 && penerima.map((item: any, index: number) => (
            <Badge variant='secondary' key={index} className='flex items-center justify-center gap-1' title='penerima'>
              <IconUserCircle size={16} strokeWidth={2} /> {item.pegawai.nama}
            </Badge>
          ))}
        </div>
      </DialogContent>
    </Dialog>

  );
};

export default DialogMenuMemoInternal;