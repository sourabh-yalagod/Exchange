"use client";
import MarketBar from "@/components/bars/MarketBar";
import Chart from "@/components/Chart";
import OrderBook from "@/components/OrderBook";
import OrderForm from "@/components/OrderForm";
import { orderBook } from "@/lib/orderBook";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Trade = () => {
  const asset = useParams()?.asset;
  console.log(asset);

  const [ticker, setTicker] = useState({
    asset: "BTCUSDT",
    openPrice: "",
    highPrice: "",
    lowPrice: "",
    currentPrice: "",
  });
  useEffect(() => {
    const socket = new WebSocket(
      `wss://stream.binance.com:9443/ws/${asset
        ?.toString()
        .toLowerCase()}@ticker`
    );
    socket.onopen = () => {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        setTicker({
          asset: data.s,
          openPrice: data.o,
          highPrice: data.h,
          lowPrice: data.l,
          currentPrice: data.c,
        });
      };
    };
    return () => {
      socket.close();
    };
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="py-2 flex justify-center items-center">
        <div className="w-full max-w-6xl">
          <MarketBar ticker={ticker} />
        </div>
      </div>

      {/* Main content - grows to fill available space */}
      <div className="flex-grow grid grid-cols-1 gap-1 border-2 px-2 lg:grid-cols-12">
        <div className="w-full border-x-2 gap-2 lg:col-span-7 xl:col-span-8">
          <Chart asset={asset || ""} />
        </div>
        <div className="grid gap-3 md:flex lg:col-span-5 xl:col-span-4">
          <OrderBook orderBook={orderBook} />
          <OrderForm marketPrice={ticker?.currentPrice || "0"} />
        </div>
      </div>

      {/* Footer - fixed height */}
      <div className="py-2 px-2">
        <div className="bg-gray-500 w-full h-[150px]"></div>
      </div>
    </div>
  );
};

export default Trade;
