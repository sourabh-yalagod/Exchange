"use client";
import React, { FormEvent, useState } from "react";

const OrderForm = ({ marketPrice }: { marketPrice: string }) => {
  const [orderType, setOrderType] = useState("market"); // 'market' | 'limit'
  const [side, setSide] = useState("buy"); // 'buy' | 'sell'
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [leverage, setLeverage] = useState(1);
  const balance = 500;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const orderData = {
      type: orderType,
      side,
      price:
        orderType === "limit"
          ? ((Number(price) * Number(quantity)) / leverage).toFixed(2)
          : ((Number(marketPrice) * Number(quantity)) / leverage).toFixed(2),
      quantity: Number(quantity).toFixed(2),
      leverage,
    };

    console.log("Placing order:", orderData);
  };

  return (
    <div className="w-full border-1 text-sm sm:text-xs space-y-4 max-w-md mx-auto bg-white dark:bg-gray-900 p-2">
      <h1 className="font-bold text-xl text-center">Place Panel</h1>
      <div className="flex gap-1 justify-between">
        <button
          onClick={() => setSide("buy")}
          className={`py-1 w-1/2 rounded text-white font-semibold ${
            side === "buy" ? "bg-green-500" : "bg-gray-600"
          }`}
        >
          Buy {Number(marketPrice).toFixed(2)}
        </button>
        <button
          onClick={() => setSide("sell")}
          className={`py-1 w-1/2 rounded text-white font-semibold  ${
            side === "sell" ? "bg-red-500" : "bg-gray-600"
          }`}
        >
          Sell {Number(marketPrice).toFixed(2)}
        </button>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
          Order Type
        </label>
        <select
          value={orderType}
          onChange={(e) => setOrderType(e.target.value)}
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
        >
          <option value="market">Market</option>
          <option value="limit">Limit</option>
        </select>
      </div>

      {orderType === "limit" && (
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
            Limit Price
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
            placeholder="Enter price"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
          Quantity
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
          placeholder="Enter quantity"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
          Leverage: <span className="font-semibold">{leverage}x</span>
        </label>
        <input
          type="range"
          min={1}
          max={200}
          step={5}
          value={leverage}
          onChange={(e) => setLeverage(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="flex justify-between items-center md:grid">
        <div>Balance : {Number(balance).toFixed(2)}</div>
        <div>
          Required Margin : {(Number(marketPrice) / leverage).toFixed(2)}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className={`w-full py-2 rounded-xl text-white font-semibold ${
          side === "buy"
            ? "bg-green-500 hover:bg-green-600"
            : "bg-red-500 hover:bg-red-600"
        }`}
      >
        {Number(marketPrice).toFixed(2)} {side === "buy" ? "Buy" : "Sell"} Order
      </button>
    </div>
  );
};

export default OrderForm;
