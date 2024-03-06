import { Button } from '@/components/ui/button';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { IconMenu2 } from '@tabler/icons-react';
import AppMenu from '../menu/app-menu';

export function OffCanvasMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className='flex lg:hidden'>
          <IconMenu2 className='h-6 w-6' />
        </Button>
      </SheetTrigger>
      <SheetContent side='left'>
        <AppMenu />
      </SheetContent>
    </Sheet>
  );
}
