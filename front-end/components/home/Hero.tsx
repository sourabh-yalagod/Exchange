"use client";
import { Download, Eye, EyeOff, Mic2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Hero = ({ showBalance, setShowBalance, balance }: any) => {
  const router = useRouter();
  return (
    <div className="text-4xl text-text space-y-1 overflow-hidden sm:space-y-4 md:space-y-8 sm:text-6xl lg:text-7xl capitalize font-semibold">
      Discuss Everything Crypto on <br />
      <span className="text-yellow-400 uppercase underline underline-offset-8">
        Binance Square
      </span>{" "}
      <div className="text-lg flex gap-3 item-center pt-10">
        Your Estimated Balance{" "}
        {showBalance ? (
          <Eye onClick={() => setShowBalance((prev: any) => !showBalance)} />
        ) : (
          <EyeOff onClick={() => setShowBalance((prev: any) => !showBalance)} />
        )}
      </div>
      <div className="text-3xl h-10">
        {showBalance ? (
          `$${Number(balance).toFixed(2)}`
        ) : (
          <div className="text-2xl sm:text-7xl -translate-y-4">******</div>
        )}
      </div>
      <div className="flex text-[10px] sm:text-xl items-center gap-3 sm:gap-5 md:gap-10">
        <div
          onClick={() => router.push(`/deposite`)}
          className="px-1 w-fit cursor-pointer rounded-sm font-mono flex gap-2 items-center py-2 text-slate-800 font-semibold uppercase bg-yellow-400 hover:scale-105 transition-all"
        >
          <Download className="size-3 sm:size-6" />
          Deposite
        </div>
        <button
          onClick={() => router.push(`/trade/BTC`)}
          className="bg-[#1e2329] p-2 rounded-lg text-white cursor-pointer hover:scale-105 transition-all"
        >
          Trade
        </button>
        <button className="bg-[#1e2329] p-2 rounded-lg text-white cursor-pointer hover:scale-105 transition-all">
          Convert
        </button>
      </div>
      <div className="flex pt-5 items-center gap-3 text-lg dark:text-slate-200">
        <Mic2 />
        Notice of Removal of Spot Trading Pairs - 2025-05-23 2025-05-21
      </div>
    </div>
  );
};

export default Hero;
