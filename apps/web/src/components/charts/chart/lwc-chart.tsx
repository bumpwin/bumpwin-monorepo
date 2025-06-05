"use client";

import {
  CandlestickSeries,
  ColorType,
  type IChartApi,
  type PriceLineOptions,
  createChart,
} from "lightweight-charts";
import { useEffect, useRef } from "react";

export interface OHLCData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface LWCChartProps {
  data?: OHLCData[];
  currentPrice?: number;
  height?: number;
  className?: string;
  priceLines?: Partial<PriceLineOptions>[];
}

export function LWCChart({
  data,
  currentPrice = 0.000026,
  height = 400,
  className = "",
  priceLines = [],
}: LWCChartProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const chart: IChartApi = createChart(container.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "rgba(255, 255, 255, 0.9)",
      },
      grid: {
        vertLines: { color: "rgba(42, 46, 57, 0.5)" },
        horzLines: { color: "rgba(42, 46, 57, 0.5)" },
      },
      width: container.current.clientWidth,
      height: height,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: "rgba(42, 46, 57, 0.5)",
      },
      rightPriceScale: {
        borderColor: "rgba(42, 46, 57, 0.5)",
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a", // Green for up candles
      downColor: "#ef5350", // Red for down candles
      borderVisible: false,
      wickUpColor: "#26a69a", // Green for upper wicks
      wickDownColor: "#ef5350", // Red for lower wicks
    });

    // デフォルトのOHLCデータ
    const defaultOhlcData: OHLCData[] = generateDefaultData();

    // 提供されたデータまたはデフォルトデータを使用
    candlestickSeries.setData(data || defaultOhlcData);

    // 現在価格のラインを追加
    if (currentPrice > 0 && data && data.length > 0) {
      const basePrice = data?.[0]?.close ?? 0;
      const percentage = ((currentPrice - basePrice) / basePrice) * 100;
      candlestickSeries.createPriceLine({
        price: currentPrice,
        color: "#4CAF50",
        lineWidth: 1,
        lineStyle: 2, // dashed
        axisLabelVisible: true,
        title: `Current Price | Market Cap: $${currentPrice.toLocaleString()} | Chance: ${percentage.toFixed(0)}%`,
      });
    }

    // 追加の価格ラインを追加
    for (const line of priceLines) {
      if (line.price !== undefined && data && data.length > 0) {
        const basePrice = data?.[0]?.close ?? 0;
        const percentage = ((line.price - basePrice) / basePrice) * 100;
        candlestickSeries.createPriceLine({
          price: line.price,
          color: line.color ?? "#22c55e",
          lineWidth: line.lineWidth ?? 1,
          lineStyle: line.lineStyle ?? 2,
          axisLabelVisible: line.axisLabelVisible ?? true,
          title: `${line.title || "Price"} | Market Cap: $${line.price.toLocaleString()} | Chance: ${percentage.toFixed(0)}%`,
        });
      }
    }

    chart.timeScale().fitContent();

    const resize = () => {
      if (container.current) {
        chart.applyOptions({ width: container.current.clientWidth });
      }
    };

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      chart.remove();
    };
  }, [data, currentPrice, height, priceLines]);

  return (
    <div ref={container} className={`w-full ${className}`} style={{ height: `${height}px` }} />
  );
}

// デフォルトのOHLCデータ生成
function generateDefaultData(): OHLCData[] {
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 15); // 15日前から

  const result: OHLCData[] = [];
  let price = 0.000025;

  for (let i = 0; i < 15; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);

    // 日付をYYYY-MM-DD形式に変換
    const timeStr = date.toISOString().split("T")[0] || "";

    // ランダムな値動きを生成
    const changePercent = (Math.random() - 0.5) * 0.1; // -5%から+5%
    const open = price;
    const close = open * (1 + changePercent);
    const high = Math.max(open, close) * (1 + Math.random() * 0.03);
    const low = Math.min(open, close) * (1 - Math.random() * 0.03);

    result.push({
      time: timeStr,
      open,
      high,
      low,
      close,
    });

    // 次の日の始値は前日の終値
    price = close;
  }

  return result;
}
