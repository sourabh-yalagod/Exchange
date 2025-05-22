import { Download, Menu, Search, UserCheck2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import NavigationBar from "./NavigationBar";
import { ModeToggle } from "../theme/ModeToggler";

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
      <div className="flex gap-4 items-center justify-between">
        <Search
          className="hover:scale-105 hover:transition-all font-bold"
          color="yellow"
        />
        <div className="px-1 cursor-pointer rounded-sm font-mono flex gap-2 items-center py-2 dark:dark-component-bg font-bold uppercase bg-yellow-400">
          <Download />
          Deposite
        </div>
        <UserCheck2 className="p-2 size-10 rounded-full text-slate-100 cursor-pointer" />
        <Menu className="md:hidden" />
        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;
