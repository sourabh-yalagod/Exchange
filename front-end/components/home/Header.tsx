import { Download, Menu, Search, UserCheck2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import NavigationBar from "./NavigationBar";
import { ModeToggle } from "../theme/ModeToggler";
import { SideBar } from "../bars/SideBar";

const Header = () => {
  return (
    <div className="w-full shadow-lg border-b-2 px-4 items-center flex justify-between">
      <div className="flex items-center gap-2">
        <Image
          src="/exchange-logo.png"
          alt="exchange-logo.jpg"
          width={100}
          height={500}
          className="cursor-pointer hover:scale-95 transition-all"
        />
        <NavigationBar />
      </div>
      <div className="hidden gap-4 sm:flex items-center justify-between">
        <Search className="hover:scale-105 hover:transition-all font-bold" />
        <div className="p-1 text-[9px] sm:text-[12px] md:text-[14px] lg:text-[15px] font-semibold cursor-pointer rounded-sm font-mono flex gap-2 items-center dark:dark-component-bg uppercase bg-yellow-400">
          <Download size={16} />
          Deposite
        </div>
        <UserCheck2 className="p-2 size-10 rounded-full dark:text-slate-100 cursor-pointer" />
        <ModeToggle />
      </div>
      <div className="sm:hidden">
        <SideBar />
      </div>
    </div>
  );
};

export default Header;
