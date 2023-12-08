import AppMenu from "../menu/app-menu";

export function Sidebar() {
  return (
    <aside id="default-sidebar" className="fixed top-0 left-0 z-[10] pt-10 w-64 h-screen transition-transform -translate-x-full lg:translate-x-0 border-r border-border bg-white dark:bg-background" aria-label="Sidebar">
      <AppMenu />
    </aside>
  )
}