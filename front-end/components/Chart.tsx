"use client";

import React, { useEffect, useRef } from "react";
import {
  createChart,
  CrosshairMode,
  ISeriesApi,
  UTCTimestamp,
} from "lightweight-charts";
import { useTheme } from "next-themes";

const Chart = ({ asset }: any) => {
  const { forcedTheme } = useTheme();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create the chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { color: forcedTheme == "light" ? "#fffff" : "#181a20" },
        textColor: forcedTheme == "light" ? "#4A4F52" : "#A0ADB7",
      },
      grid: {
        vertLines: { color: forcedTheme == "light" ? "#A6AFB7" : "#2B2E2F" },
        horzLines: { color: forcedTheme == "light" ? "#A6AFB7" : "#2B2E2F" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      timeScale: {
        borderColor: "#cccccc",
      },
    });

    const candleSeries = chart.addCandlestickSeries();
    candleSeriesRef.current = candleSeries;

    fetch(
      `https://api.binance.com/api/v3/klines?symbol=${asset}&interval=1d&limit=360`,
    )
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.map((candle: any) => ({
          time: (candle[0] / 1000) as UTCTimestamp,
          open: parseFloat(candle[1]),
          high: parseFloat(candle[2]),
          low: parseFloat(candle[3]),
          close: parseFloat(candle[4]),
        }));

        // Set full historical data
        candleSeries.setData(formattedData);
      });
    const socket = new WebSocket(
      `wss://stream.binance.com:9443/ws/${asset.toLowerCase()}@kline_1m`,
    );

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (!message.k) return;

      const k = message.k;

      const liveCandle = {
        time: (k.t / 1000) as UTCTimestamp,
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c),
      };

      candleSeriesRef.current?.update(liveCandle);
    };

    const handleResize = () => {
      chart.resize(chartContainerRef.current!.clientWidth, 400);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      socket.close();
      chart.remove();
    };
  }, []);

  return (
    <div
      ref={chartContainerRef}
      className="w-full h-full"
      style={{ position: "relative" }}
    />
  );
};

export default Chart;
