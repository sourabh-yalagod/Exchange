"use client";
import addTrades, { handlePlaceOrder } from "@/state/slice/tradeSlice";
import { useAppDispatch } from "@/state/store";
import { randomUUID } from "crypto";
import React, { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
const OrderForm = ({
  marketPrice,
  asset,
}: {
  marketPrice: number;
  asset: string;
}) => {
  const [orderType, setOrderType] = useState("market"); // 'market' | 'limit'
  const [side, setSide] = useState("bids"); // 'bids' | 'asks'
  const [price, setPrice] = useState("");
  const [sl, setSl] = useState("");
  const [target, setTarget] = useState("");
  const [quantity, setQuantity] = useState("");
  const [leverage, setLeverage] = useState(1);
  const balance = 500;
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const orderData = {
      type: orderType,
      side,
      openPrice: orderType === "limit" ? Number(price) : Number(marketPrice),
      margin: Number(
        orderType === "limit"
          ? ((Number(price) * Number(quantity)) / leverage).toFixed(2)
          : ((marketPrice * Number(quantity)) / leverage).toFixed(2),
      ),
      quantity: Number(Number(quantity).toFixed(2)),
      leverage,
      target: Number(target),
      sl: Number(sl),
    };
    if (Number(orderData?.quantity) == 0 || !orderData?.margin) return;
    if (sl != "" || target != "") {
      if (orderData.side == "bids") {
        if (orderData.target && orderData.openPrice > orderData.target) {
          toast(`Target suppose to be Smaller then ${orderData.openPrice}`);
          return;
        }
        if (orderData.sl && orderData.openPrice < orderData.sl) {
          toast(`Stop Loss suppose to be Smaller then ${orderData.openPrice}`);
          return;
        }
      } else {
        if (orderData.sl && orderData.openPrice > orderData.sl) {
          toast(`Stop Loss suppose to be Greate then ${orderData.openPrice}`);
          return;
        }
        if (orderData.target && orderData.openPrice < orderData.target) {
          toast(`Target suppose to be Less then ${orderData.openPrice}`);
          return;
        }
      }
    }
    const orderPayload = {
      margin: orderData.margin,
      price: orderData.openPrice,
      quantity: orderData.quantity,
      userId: "",
      asset,
      side,
      orderId: uuidv4(),
      type: orderData.type,
      sl: Number(sl),
      target: Number(target),
      leverage,
    };
    console.log("orderPayload : ", orderPayload);
    await dispatch(handlePlaceOrder(orderPayload));
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 space-y-3 text-sm sm:text-xs">
      <h1 className="font-bold text-2xl text-center text-gray-800 dark:text-gray-100">
        Place Panel
      </h1>

      <div className="flex gap-2">
        <button
          onClick={() => setSide("bids")}
          className={`w-1/2 py-2 rounded-lg font-semibold text-white transition-colors duration-200 ${
            side === "bids"
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-600 hover:bg-gray-700"
          }`}
        >
          Buy {marketPrice?.toFixed(2)}
        </button>
        <button
          onClick={() => setSide("asks")}
          className={`w-1/2 py-2 rounded-lg font-semibold text-white transition-colors duration-200 ${
            side === "asks"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gray-600 hover:bg-gray-700"
          }`}
        >
          Sell {marketPrice?.toFixed(2)}
        </button>
      </div>

      <div className="space-y-1">
        <label className="block font-medium text-gray-700 dark:text-gray-300">
          Order Type
        </label>
        <select
          value={orderType}
          onChange={(e) => setOrderType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="market">Market</option>
          <option value="limit">Limit</option>
        </select>
      </div>

      {orderType === "limit" && (
        <div className="space-y-1">
          <label className="block font-medium text-gray-700 dark:text-gray-300">
            Limit Price
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter price"
          />
        </div>
      )}

      <div className="space-y-1">
        <label className="block font-medium text-gray-700 dark:text-gray-300">
          Quantity
        </label>
        <input
          type="number"
          value={quantity!}
          onChange={(e: any) => setQuantity(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter quantity"
        />
      </div>

      <div className="space-y-1">
        <label className="block font-medium text-gray-700 dark:text-gray-300">
          Stop Loss
        </label>
        <input
          type="number"
          value={sl}
          onChange={(e) => setSl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter stop loss"
        />
      </div>

      <div className="space-y-1">
        <label className="block font-medium text-gray-700 dark:text-gray-300">
          Target
        </label>
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter target"
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium text-gray-700 dark:text-gray-300">
          Leverage: <span className="font-semibold">{leverage}x</span>
        </label>
        <input
          type="range"
          min={1}
          max={200}
          step={5}
          value={leverage}
          onChange={(e) => setLeverage(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
        <span>Balance: {Number(balance).toFixed(2)}</span>
        <span>Required Margin: {(marketPrice / leverage).toFixed(2)}</span>
      </div>

      <button
        onClick={handleSubmit}
        className={`w-full py-2 rounded-lg font-semibold text-white shadow transition duration-200 ${
          side === "bids"
            ? "bg-green-500 hover:bg-green-600"
            : "bg-red-500 hover:bg-red-600"
        }`}
      >
        {marketPrice?.toFixed(2)} {side === "bids" ? "Buy" : "Sell"} Order
      </button>
    </div>
  );
};

export default OrderForm;
