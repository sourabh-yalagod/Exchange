"use client";
import { closeTrade } from "@/state/slice/tradeSlice";
import { X } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";

type Trade = {
  side: "bids" | "asks";
  type: string;
  price: string;
  quantity: string;
  leverage: number;
  sl?: string;
  target?: string;
};

const TradeTab = ({ trades, currentPrice }: any) => {
  const dispatch = useDispatch();
  const handleCloseTrade = (tradeId: string) => {
    dispatch(closeTrade({ tradeId }));
  };
  return (
    <div className="w-full mx-auto p-4">
      <div className="grid  place-items-center grid-cols-2 sm:grid-cols-4 md:grid-cols-8 font-semibold text-sm sm:text-base border-b border-gray-300 dark:border-gray-600 pb-2 mb-2 text-gray-700 dark:text-gray-300">
        <div>Type</div>
        <div>Open Price</div>
        <div>Current Price</div>
        <div>SL</div>
        <div>Target</div>
        <div>Leverage and Margin</div>
        <div>position</div>
        <div>Action</div>
      </div>

      <div className="space-y-2">
        {trades.map((trade: any, index: number) => {
          const isBuy = trade?.side === "bids";
          return (
            <div
              key={index}
              className="grid place-items-center relative grid-cols-2 sm:grid-cols-4 md:grid-cols-8 items-center text-sm sm:text-base p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <div>
                <span
                  className={`px-2 py-1 rounded-full text-white text-xs sm:text-sm font-medium ${
                    isBuy ? "bg-blue-600" : "bg-red-600"
                  }`}
                >
                  {trade?.side.toUpperCase()}
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {trade.type}
                </div>
              </div>
              <div>${trade.openPrice}</div>
              <div>${Number(currentPrice).toFixed(2)}</div>
              <div>{trade.sl ?? "-"}</div>
              <div>{trade.target ?? "-"}</div>
              <div className="font-thin text-center text-slate-300">
                <p>{trade.leverage}x</p>
                <p>${trade.margin}</p>
              </div>
              <div>
                {trade.type == "limit" ? (
                  <>
                    <X />
                    <span>Cancel order</span>
                  </>
                ) : (
                  <>
                    <div className="text-lg font-bold tracking-widest uppercase">
                      p/l
                    </div>
                    <span>
                      {trade.side == "sell"
                        ? (Number(currentPrice) - trade.price).toFixed(2)
                        : Number(trade.price - Number(currentPrice)).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
              <div
                onClick={() => handleCloseTrade(trade.orderId)}
                className="hover:bg-slate-900 px-2 py-1 cursor-pointer hover:scale-105 transition-all rounded-xl grid place-items-center"
              >
                <X />
                Close
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TradeTab;
