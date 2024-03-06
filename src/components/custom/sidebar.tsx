import AppMenu from '../menu/app-menu';

export function Sidebar() {
  return (
    <aside
      id='default-sidebar'
      className='fixed left-0 top-0 z-[10] h-screen w-64 -translate-x-full border-r border-border bg-white pt-10 transition-transform dark:bg-background lg:translate-x-0'
      aria-label='Sidebar'
    >
      <AppMenu />
    </aside>
  );
}
