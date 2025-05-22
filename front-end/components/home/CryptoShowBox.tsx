"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const CryptoShowBox = ({ cryptos }: any) => {
  const demo = cryptos?.slice(0, 10)?.map((crypt: any) => {
    return {
      title: crypt.symbol,
      name: crypt.symbol,
      price: crypt.lastPrice,
      image: "/btc.png",
      status: crypt.priceChangePercent,
    };
  });
  const router = useRouter();
  return (
    <div
      className="rounded-xl max-h-[300px] overflow-scroll border-[1px] p-2
     grid place-items-center dark:bg-[#1e2329]"
    >
      {demo?.map((crypto: any, index: number) => {
        return (
          <div
            key={index}
            onClick={() => router.push(`/trade/${crypto?.name}`)}
            className="flex max-w-[350px] cursor-pointer hover:scale-105 transition-all justify-between w-full py-3 items-center"
          >
            <div className="flex items-center justify-around">
              <div className="flex items-center gap-3">
                <Image
                  src={crypto.image}
                  alt={crypto.name}
                  height={40}
                  width={40}
                  className="rounded-full"
                />
                <div className="flex items-center gap-3">
                  <h1 className="">
                    {crypto.title.toUpperCase().split("USD")[0]}
                  </h1>
                  <h1 className="text-lg">{crypto.name.toLowerCase()}</h1>
                </div>
              </div>
            </div>
            <div
              className={`font-semibold ${
                Number(crypto.status) > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${Number(crypto.price).toFixed(2)}
            </div>
            <div
              className={`font-semibold ${
                Number(crypto.status) > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {crypto.status.concat(" %")}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CryptoShowBox;
