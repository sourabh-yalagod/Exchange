"use client";
import { axiosInstance } from "@/lib/axiosInstance";
import { closeTrade } from "@/state/slice/tradeSlice";
import { useQuery } from "@tanstack/react-query";
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

const TradeTab = ({ currentPrice }: any) => {
  const dispatch = useDispatch();
  const handleCloseTrade = (tradeId: string) => {
    dispatch(closeTrade({ tradeId }));
  };
  const fetchTrades = async () => {
    const { data } = await axiosInstance.get("/api/database/order");
    return data;
  };
  const { data, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchTrades,
  });
  console.log({ data, isLoading, error });

  return (
    <div className="w-full mx-auto p-4">
      <div className="grid  place-items-center grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-7 font-semibold text-sm sm:text-base border-b border-gray-300 dark:border-gray-600 pb-2 mb-2 text-gray-700 dark:text-gray-300">
        <div>Type</div>
        <div>Open Price</div>
        <div>Current Price</div>
        <div>SL</div>
        <div>Target</div>
        <div>position</div>
        <div>Action</div>
      </div>

      <div className="space-y-2">
        {data?.data?.orders?.map((trade: any, index: number) => {
          const isBuy = trade.side.toLowerCase() === "bids"; // or 'buy'
          const isFilled = trade.status === "filled";
          const isLimit = trade.type === "limit";
          const priceDiff = isBuy
            ? Number(currentPrice) - Number(trade.price)
            : Number(trade.price) - Number(currentPrice);
          const profitLoss = priceDiff.toFixed(2);
          return (
            <div
              key={index}
              className="grid place-items-center relative grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-7 items-center text-sm sm:text-base p-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {/* SIDE and TYPE */}
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1rounded-full text-white text-xs sm:text-sm font-medium ${
                    isBuy ? "bg-blue-600" : "bg-red-600"
                  }`}
                >
                  {trade.side.toUpperCase()}
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {trade.type}
                </div>
              </div>

              {/* Open Price */}
              <div>${trade.price}</div>

              {/* Current Price */}
              <div>${Number(currentPrice).toFixed(2)}</div>

              {/* SL & Target */}
              <div>{trade.sl ?? "-"}</div>
              <div>{trade.target ?? "-"}</div>

              {/* Status Column */}
              <div>
                {isLimit && trade.status === "pending" ? (
                  <div className="text-gray-400">
                    <span>Pending......</span>
                  </div>
                ) : (
                  <>
                    <span
                      className={`font-medium ${
                        priceDiff > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {profitLoss}
                    </span>
                  </>
                )}
              </div>
              <div>
                {trade.status == "pending" ? (
                  <div className="flex gap-2 bg-gray-700 p-1 rounded-md hover:scale-95 transition-all cursor-pointer items-center text-xs font-semibold">
                    Close
                    <X size={10} />
                  </div>
                ) : (
                  <div className="flex gap-2 bg-gray-700 p-1 rounded-md hover:scale-95 transition-all cursor-pointer items-center text-xs font-semibold">
                    book
                    <X />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TradeTab;
