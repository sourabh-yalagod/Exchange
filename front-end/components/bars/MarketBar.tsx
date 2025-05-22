"use client";
import React from "react";

const MarketBar = ({ ticker }: any) => {
  if (!ticker.openPrice) {
    return (
      <nav className="px-4 py-2 shadow-md sticky w-full top-0 z-50">
        Loading
      </nav>
    );
  }
  return (
    <div className="px-4 py-2 shadow-md sticky w-full top-0 z-50 mx-auto flex flex-wrap items-center justify-between gap-4">
      <div className="text-lg font-bold text-yellow-400">
        {ticker.asset} Ticker
      </div>
      <div className="flex flex-wrap gap-4 text-sm md:text-base">
        <MarketBarItem lable={"open Price"} price={ticker.openPrice} />
        <MarketBarItem lable={"close Price"} price={ticker.highPrice} />
        <MarketBarItem lable={"low Price"} price={ticker.lowPrice} />
        <MarketBarItem lable={"Market Price"} price={ticker.currentPrice} />
      </div>
    </div>
  );
};

export default MarketBar;

const MarketBarItem = ({ lable, price }: any) => {
  return (
    <span>
      <strong>{lable}:</strong> {parseFloat(price).toFixed(2)}
    </span>
  );
};
