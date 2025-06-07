"use client";

import { useBattleClock } from "@/providers/BattleClockProvider";
import type React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

// Define the structure for a single data point in the chart
export interface ChartDataPoint {
  timestamp: number | string;
  [coinSymbol: string]: number | string;
}

// Define the structure for coin metadata in the source data
export interface CoinMeta {
  id: number;
  symbol: string;
  name: string;
  color?: string;
}

// Define the structure for prepared coin metadata
export interface PreparedCoinMeta {
  symbol: string;
  name: string;
  color: string;
}

interface DominanceRechartProps {
  points: ChartDataPoint[];
  coins: PreparedCoinMeta[];
  height?: number;
  className?: string;
  compact?: boolean;
  hideLegend?: boolean;
  showAllTime?: boolean;
}

// Custom tooltip (similar to DominanceChart)
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-white/10 bg-black/90 p-3 text-white shadow-lg backdrop-blur-sm">
        <p className="mb-1 border-white/20 border-b pb-1 text-center font-medium text-sm">
          {typeof label === "number" ? `${label} min` : label}
        </p>
        <div className="space-y-1">
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="font-medium text-xs">{entry.name}</span>
              </div>
              <span className="font-bold text-sm">{(entry.value as number).toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Format tick for x-axis
const formatXAxis = (tickItem: number) => {
  const hours = Math.floor(tickItem / 60);
  const minutes = tickItem % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

// Format tick for y-axis (as percentage)
const formatYAxis = (tickItem: number) => {
  return `${tickItem.toFixed(0)}%`;
};

const DominanceRechart: React.FC<DominanceRechartProps> = ({
  points,
  coins,
  height = 300,
  className = "",
  compact = false,
  hideLegend = false,
  showAllTime = false,
}) => {
  const { remainingTime, totalTime } = useBattleClock();
  const currentMinute = Math.floor((totalTime - remainingTime) / 60);

  // データのフィルタリング
  const filteredPoints = showAllTime
    ? points
    : points.filter(
        (point) => typeof point.timestamp === "number" && point.timestamp <= currentMinute,
      );

  // 24時間の固定スケールを設定
  const startTime = 0; // 00:00
  const endTime = 25 * 60; // 25:00 (分単位)

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={filteredPoints}
          margin={
            compact
              ? { top: 5, right: 20, left: 5, bottom: hideLegend ? 5 : 20 }
              : { top: 5, right: 30, left: 0, bottom: hideLegend ? 5 : 20 }
          }
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#555" />
          <XAxis
            dataKey="timestamp"
            type="number"
            domain={[startTime, endTime]}
            tickFormatter={formatXAxis}
            tick={{ fontSize: compact ? 8 : 10, fill: "#999" }}
            minTickGap={compact ? 60 : 40}
            axisLine={{ stroke: "#555" }}
            tickLine={{ stroke: "#555" }}
          />
          <YAxis
            tickFormatter={formatYAxis}
            domain={["auto", "auto"]}
            tick={{ fontSize: compact ? 8 : 10, fill: "#999" }}
            axisLine={{ stroke: "#555" }}
            tickLine={{ stroke: "#555" }}
            allowDataOverflow={true}
            width={compact ? 35 : 40}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "#8884d8",
              strokeWidth: 1,
              strokeDasharray: "3 3",
            }}
          />
          {/* Daytime (0h-24h)にやや透明な帯を追加 */}
          <ReferenceArea
            x1={0}
            x2={24 * 60}
            stroke="#fde047"
            fill="#fde047"
            fillOpacity={0.05}
            label={{
              value: "Daytime",
              position: "insideTopLeft",
              fill: "#fde047",
              fontSize: 14,
              fontWeight: "bold",
            }}
          />
          {/* 最後の1時間（24h-25h）に半透明の帯を追加 */}
          <ReferenceArea
            x1={24 * 60}
            x2={25 * 60}
            stroke="#a78bfa"
            fill="#a78bfa"
            fillOpacity={0.05}
            label={{
              value: "Darknight",
              position: "insideTopRight",
              fill: "#a78bfa",
              fontSize: 14,
              fontWeight: "bold",
            }}
          />
          {!hideLegend && (
            <Legend
              wrapperStyle={{
                paddingTop: 10,
                bottom: 0,
                opacity: 0.8,
                fontSize: compact ? "10px" : "12px",
              }}
            />
          )}
          {coins.map((coin) => (
            <Line
              key={coin.symbol}
              type="monotone"
              dataKey={coin.symbol}
              name={coin.name}
              stroke={coin.color}
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: compact ? 4 : 6,
                strokeWidth: 0,
                fill: coin.color,
              }}
              animationDuration={1000}
              animationBegin={0}
              isAnimationActive={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DominanceRechart;
