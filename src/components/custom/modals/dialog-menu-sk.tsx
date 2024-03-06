import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IconEdit, IconTrash } from '@tabler/icons-react';

type Props = {
  data: any;
  isOpenMenu: boolean;
  setIsOpenMenu: (value: boolean) => void;
  setIsFormEditOpen: (value: boolean) => void;
  handleDelete: (value: any) => void;
};

const DialogMenuSk = (props: Props) => {
  const { data, isOpenMenu, setIsOpenMenu, setIsFormEditOpen, handleDelete } =
    props;
  return (
    <Dialog open={isOpenMenu} onOpenChange={setIsOpenMenu}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Menu SK Direktur</DialogTitle>
          <DialogDescription>
            You can manipulate this data, using the menu below. but be careful
            to do it, cause it can cause errors like duplicate data in the
            database.
          </DialogDescription>
        </DialogHeader>
        <div className='flex w-full items-center justify-end'>
          <Button
            variant={'default'}
            size={'sm'}
            onClick={() => {
              setIsFormEditOpen(true);
              setIsOpenMenu(false);
            }}
          >
            <IconEdit className='mr-2 h-5 w-5' />{' '}
            <span className='font-bold'>Edit SK</span>
          </Button>
          <Button
            variant={'destructive'}
            size={'sm'}
            className='ml-2'
            onClick={() => {
              handleDelete(data);
              setIsOpenMenu(false);
            }}
          >
            <IconTrash className='h-5 w-5' />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogMenuSk;
