"use client";
import MarketBar from "@/components/bars/MarketBar";
import Chart from "@/components/Chart";
import OrderBook from "@/components/OrderBook";
import OrderForm from "@/components/OrderForm";
import TradeTab from "@/components/TradeTab";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Trade = () => {
  const trades = useSelector((state: any) => state?.tradeReducer?.trades);
  const asset = useParams()?.asset;
  const [orderBook, setOrderBook] = useState();
  const [ticker, setTicker] = useState({
    asset,
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
    const socket2 = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL!);
    socket2.onopen = () => {
      console.log(`Socket Connected to ${asset} PUBSUB`);
      socket2.send(
        JSON.stringify({
          event: "SUBSCRIBE",
          subscribe: String(asset),
        })
      );
      socket2.onclose = () => {
        console.log("socket connection closed..!");
      };
      socket2.onmessage = (event) => {
        console.log("OrderBook", JSON.parse(event.data));

        setOrderBook(JSON.parse(event.data));
      };
    };
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
          <OrderForm
            asset={asset as string}
            marketPrice={Number(ticker?.currentPrice) || 0}
          />
        </div>
      </div>

      {/* Footer - fixed height */}
      <div className="py-2 px-2">
        <div className="w-full overflow-scroll h-[150px]">
          {/* <TradeTab
            trades={trades}
            currentPrice={Number(ticker?.currentPrice || "0")}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default Trade;
