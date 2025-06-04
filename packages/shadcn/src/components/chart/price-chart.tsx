"use client";

import { ColorType, type IChartApi, LineSeries, LineStyle, createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";

export interface PriceChartData {
  time: string;
  value: number;
}

interface PriceChartProps {
  data?: PriceChartData[];
  height?: number;
  width?: number;
  className?: string;
  lineColor?: string;
}

function generateMockData(): PriceChartData[] {
  const data: PriceChartData[] = [];
  const now = new Date();
  let value = 100;

  for (let i = 0; i < 30; i++) {
    const time = new Date(now.getTime() - (30 - i) * 24 * 60 * 60 * 1000);
    value = value + (Math.random() - 0.5) * 10;
    const dateStr = time.toISOString().split("T")[0];
    if (dateStr) {
      data.push({
        time: dateStr,
        value: Math.max(0, value),
      });
    }
  }

  return data;
}

export function PriceChart({
  data = generateMockData(),
  height = 300,
  width,
  className,
  lineColor = "rgba(76, 175, 80, 1)",
}: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // データの検証とログ出力
    console.log("Chart data:", data, data.length);

    if (data.length === 0) {
      console.warn("No data provided for chart");
      return;
    }

    // 先にチャートの破棄処理を実行
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const containerWidth = width || chartContainerRef.current.clientWidth;

    // コンテナのサイズのログ
    console.log("Chart container size:", {
      width: containerWidth,
      height,
      clientWidth: chartContainerRef.current.clientWidth,
      clientHeight: chartContainerRef.current.clientHeight,
    });

    // サイズのバリデーション
    if (containerWidth <= 0 || height <= 0) {
      console.warn("Chart container has invalid dimensions");
      return;
    }

    try {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          textColor: "rgba(255, 255, 255, 0.9)",
        },
        grid: {
          vertLines: { color: "rgba(255, 255, 255, 0.1)" },
          horzLines: { color: "rgba(255, 255, 255, 0.1)" },
        },
        width: containerWidth,
        height,
        timeScale: {
          timeVisible: true,
          borderColor: "rgba(255, 255, 255, 0.1)",
        },
        rightPriceScale: {
          borderColor: "rgba(255, 255, 255, 0.1)",
        },
      });

      // データ形式の修正（日付形式をそのまま使用）
      const formattedData = data.map((item) => {
        return {
          time: item.time, // 文字列形式のまま使用
          value: item.value,
        };
      });

      console.log("Formatted data:", formattedData);

      // 正しくラインシリーズを作成 (v5 API)
      const lineSeries = chart.addSeries(LineSeries, {
        color: lineColor,
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        crosshairMarkerVisible: true,
      });

      lineSeries.setData(formattedData);
      chart.timeScale().fitContent();
      chartRef.current = chart;

      const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
          const newWidth = width || chartContainerRef.current.clientWidth;
          chartRef.current.applyOptions({ width: newWidth });
          chart.timeScale().fitContent();
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
        }
      };
    } catch (error) {
      console.error("Error creating chart:", error);
    }
  }, [data, height, width, lineColor]);

  return (
    <div
      ref={chartContainerRef}
      className={className}
      style={{
        width: width ? `${width}px` : "100%",
        height: `${height}px`,
        minHeight: "200px",
      }}
    />
  );
}
