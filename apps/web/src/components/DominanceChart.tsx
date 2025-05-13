"use client";

import { format, parseISO } from "date-fns";
import type React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import type { DominanceChartData } from "../types/dominance";

// Custom tooltip for better display
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 text-white p-4 rounded-lg shadow-lg border border-white/10 backdrop-blur-sm">
        <p className="font-medium text-center border-b border-white/20 pb-2 mb-2">
          {format(parseISO(label), "HH:mm")}
        </p>
        <div className="space-y-2">
          {payload.map((entry) => (
            <div
              key={entry.name}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="font-medium text-sm">{entry.name}</span>
              </div>
              <span className="font-bold">
                {((entry.value as number) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Format tick for x-axis
const formatXAxis = (tickItem: string) => {
  return format(parseISO(tickItem), "HH:mm");
};

// Format tick for y-axis (as percentage)
const formatYAxis = (tickItem: number) => {
  return `${(tickItem * 100).toFixed(0)}%`;
};

interface DominanceChartProps {
  data: DominanceChartData;
  height?: number;
  className?: string;
  volume?: string;
  date?: string;
  coinId?: string;
  showSingleCoinOnly?: boolean;
  hideLegend?: boolean;
  compact?: boolean;
}

const DominanceChart: React.FC<DominanceChartProps> = ({
  data,
  height = 400,
  className = "",
  volume = "$6,396,866 Vol.",
  date = "Jun 18, 2025",
  coinId,
  showSingleCoinOnly = false,
  hideLegend = false,
  compact = false,
}) => {
  return (
    <div className={`w-full ${className} relative`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data.points}
          margin={compact ? {
            top: 2,
            right: 5,
            left: 15,
            bottom: 2,
          } : {
            top: 2,
            right: 10,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 10, fill: "#999" }}
            minTickGap={50}
          />
          <YAxis
            tickFormatter={formatYAxis}
            domain={[0, 1]}
            tick={{ fontSize: 10, fill: "#999" }}
          />
          <Tooltip content={<CustomTooltip />} />
          {!hideLegend && (
            <Legend
              wrapperStyle={{
                paddingTop: 10,
                bottom: 0,
                opacity: 0.8,
              }}
            />
          )}

          {showSingleCoinOnly && coinId
            ? data.coins
                .filter((c) => c.id === coinId)
                .map((coin) => (
                  <Line
                    key={coin.id}
                    type="monotone"
                    dataKey={coin.id}
                    name={coin.name}
                    stroke={coin.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                ))
            : data.coins.map((coin) => (
                <Line
                  key={coin.id}
                  type="monotone"
                  dataKey={coin.id}
                  name={coin.name}
                  stroke={coin.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Volume and date information overlay */}
      <div className="absolute bottom-1 right-8 flex items-center gap-4 text-gray-400 text-sm pb-1">
        {volume && (
          <div className="flex items-center">
            <span className="font-medium">{volume}</span>
          </div>
        )}
        {date && (
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
              aria-label="date icon"
            >
              <title>Date Icon</title>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{date}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DominanceChart;
