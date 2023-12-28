"use client";

import Link from "next/link"
import {
    Menubar,
    MenubarMenu,
  } from "@/components/ui/menubar"
import { ModeToggle } from "./mode-toggle";
import { OffCanvasMenu } from "./off-canvas-menu";
  
  export function Menu() {
    return (
      <Menubar className="sticky top-0 rounded-none border-b-border px-4 py-7 lg:px-6 w-full bg-background z-[11]">
        <div className="w-full flex items-center justify-between">
          <div className="left-menu flex items-center align-center gap-4">
            <OffCanvasMenu />

            <MenubarMenu>
              <Link className="font-bold text-lg text-primary tracking-wide" href="/dashboard">e-personal</Link>
            </MenubarMenu>
          </div>

          <div className="right-menu">
            <ModeToggle />
          </div>
        </div>
      </Menubar>
    )
  }