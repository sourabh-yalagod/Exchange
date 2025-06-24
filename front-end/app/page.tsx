"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import CryptoShowBox from "@/components/home/CryptoShowBox";
import Header from "@/components/home/Header";
import News from "@/components/home/News";
import Hero from "@/components/home/Hero";
import { exchangeItems } from "@/lib/utils";
import InfiniteScroller from "@/components/home/InfiniteScoll";
import Demo from "@/components/home/Demo";
import QnA from "@/components/home/QnA";
import Footer from "@/components/home/Footer";
import { axiosInstance } from "@/lib/axiosInstance";
const HomePage = () => {
  const [assets, setAssets] = useState([]);
  const [showBalance, setShowBalance] = useState(false);
  const [balance, setBalance] = useState(122);
  const router = useRouter();
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get(
          "https://api.binance.com/api/v3/ticker/24hr",
        );
        const usdtAssets = response.data.filter((asset: any) =>
          asset.symbol.endsWith("USDT"),
        );
        setAssets(usdtAssets.slice(0, 150));
      } catch (err) {
        console.error("Failed to fetch assets", err);
      }
    };
    fetchAssets();
  }, []);

  

  return (
    <div className="dark:dark-bg min-h-screen">
      <Header />
      <div className="pt-10 w-full space-y-5 px-3 lg:px-12 xl:px-20">
        <div className="md:flex space-y-10 justify-between grid place-items-center w-full">
          <Hero
            balance={balance}
            setShowBalance={setShowBalance}
            showBalance={showBalance}
          />
          <div className="space-y-5 w-full max-w-[400px]">
            <CryptoShowBox cryptos={assets} />
            <News />
          </div>
        </div>
        <InfiniteScroller items={exchangeItems} />
        <Demo />
        <QnA />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
