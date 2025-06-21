"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Download, Menu, UserCheck2 } from "lucide-react";
import { ModeToggle } from "../theme/ModeToggler";

export function SideBar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Menu className="sm:hidden block" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle>Sidebar Menu</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full justify-between py-4">
          <div className="flex flex-col gap-y-4">
            <div className="p-1 text-[9px] sm:text-[12px] md:text-[14px] lg:text-[15px] font-semibold cursor-pointer rounded-sm font-mono flex gap-2 items-center dark:dark-component-bg uppercase bg-yellow-400">
              <Download size={16} />
              Deposite
            </div>

            <UserCheck2 className="p-2 size-10 rounded-full dark:text-slate-100 cursor-pointer" />
            <ModeToggle />
          </div>

          <div className="self-start">
            <ModeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
