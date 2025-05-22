import Link from "next/link";
import React from "react";

const News = () => {
  return (
    <div className="rounded-xl p-4 max-h-[400px] overflow-scroll border-[1px]  text-slate-800 dark:text-slate-200 dark:bg-[#1e2329]">
      <div className="flex justify-between text-xl">
        <h1>News</h1>
        <Link href={"#"}>More</Link>
      </div>
      <p className="text-lg pt-5">
        Bitcoin Experiences Slight Decline Below $105,000 Bitcoin(BTC) Drops
        Below 105,000 USDT with a Narrowed 1.68% Increase in 24 Hours Future of
        Blockchain Development: Focus on Application Chains Solana's New
        Consensus Protocol Alpenglow Promises Enhanced Efficiency
      </p>
    </div>
  );
};

export default News;
