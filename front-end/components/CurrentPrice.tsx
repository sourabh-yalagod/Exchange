"use client";
import { useEffect, useRef, useState } from "react";

const CurrentPrice = ({ currentPrice, label }: any) => {
  const [price, setPrice] = useState<number>(currentPrice);
  const priceRef = useRef({ isUp: true });
  useEffect(() => {
    setPrice((prev: number | any) => {
      if (prev <= currentPrice) {
        priceRef.current.isUp = true;
      } else {
        priceRef.current.isUp = false;
      }
      return currentPrice;
    });
  }, [currentPrice]);
  return (
    <div
      className={`${
        priceRef.current.isUp ? "text-green-500" : "text-red-400"
      } flex items-center gap-3`}
    >
      {label && <h2 className="font-semibold text-slate-300">{label}</h2>}
      {Number(price).toFixed(2)}
    </div>
  );
};

export default CurrentPrice;
