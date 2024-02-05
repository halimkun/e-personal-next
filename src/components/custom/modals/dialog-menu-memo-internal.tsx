import React from 'react';
import he from 'he';

import { getDate } from '@/lib/date';
import { Badge } from "@/components/ui/badge"
import { Separator } from '@/components/ui/separator';
import { IconCalendar, IconKey, IconUserCircle } from '@tabler/icons-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"


interface DialogMenuMemoInternalProps {
  item: any;
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

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='mb-2'>{item.perihal?.perihal}</DialogTitle>
          <DialogDescription>
            <div className="flex items-start justify-start gap-1">
              <Badge className='flex items-center justify-center gap-1'>
                <IconUserCircle size={16} strokeWidth={2} /> {item.dari}
              </Badge>
              <Badge className='flex items-center justify-center gap-1'>
                <IconKey size={16} strokeWidth={2} /> {item.no_surat}
              </Badge>
              <Badge className='flex items-center justify-center gap-1'>
                <IconCalendar size={16} strokeWidth={2} /> {getDate(item.perihal?.tgl_terbit)}
              </Badge>
            </div>
          </DialogDescription>
        </DialogHeader>
        <Separator className='mt-2' />
        <div dangerouslySetInnerHTML={{ __html: decodedHTML(item.content) || '' }} />
      </DialogContent>
    </Dialog>

  );
};

export default DialogMenuMemoInternal;