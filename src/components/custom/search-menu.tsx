import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IconSearch } from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { buttonVariants } from '../ui/button';
import { SidebarNew } from './sidebar-new';

interface SearchMenuProps {
  menu: any;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SearchMenu = (props: SearchMenuProps) => {
  const { menu, open, setOpen } = props;
  const [search, setSearch] = React.useState<any[]>([]);

  const onSearch = (e: any) => {
    var val = e.target.value;

    if (val === '') {
      setSearch([]);
      return;
    }

    const result = Object.keys(menu).reduce((acc: any, key: any) => {
      const menuItem = menu[key];
      const filtered = menuItem.filter((item: any) =>
        item.label.toLowerCase().includes(val.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[key] = filtered;
      }
      return acc;
    }, {});
    setSearch(result);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({
          variant: 'outline',
          size: 'icon',
          className: 'h-7 w-7',
        })}
      >
        <IconSearch className='h-[1rem] w-[1rem]' />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Find Menu</DialogTitle>
          <DialogDescription>
            cannot find the menu you are looking for? use the search feature to
            find the menu you are looking for.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-1'>
          <Label htmlFor='menu'>Find Your Menu</Label>
          {/* onsearch */}
          <Input
            name='menu'
            id='menu'
            placeholder='Search menu'
            onChange={(e) => onSearch(e)}
            autoComplete='off'
          />
        </div>

        {Object.keys(search).length > 0 &&
          Object.keys(search).map((key: any, index: number) => {
            return (
              <div className='-mb-2' key={index}>
                <p className='-mb-1 px-3 text-sm font-semibold tracking-wide text-primary'>
                  {key}
                </p>
                <SidebarNew
                  key={index}
                  links={search[key]}
                  isCollapsed={false}
                />
              </div>
            );
          })}
      </DialogContent>
    </Dialog>
  );
};

export default SearchMenu;
