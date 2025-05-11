'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { CoinDisplayInfo, DominanceChartData, DominancePoint } from '../types/dominance';

// Custom tooltip for better display
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 text-white p-4 rounded-lg shadow-lg border border-white/10 backdrop-blur-sm">
        <p className="font-medium text-center border-b border-white/20 pb-2 mb-2">
          {format(parseISO(label), 'HH:mm')}
        </p>
        <div className="space-y-2">
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="font-medium text-sm">{entry.name}</span>
              </div>
              <span className="font-bold">{(entry.value as number * 100).toFixed(1)}%</span>
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
  return format(parseISO(tickItem), 'HH:mm');
};

// Format tick for y-axis (as percentage)
const formatYAxis = (tickItem: number) => {
  return `${(tickItem * 100).toFixed(0)}%`;
};

interface DominanceChartProps {
  data: DominanceChartData;
  height?: number;
  className?: string;
}

const DominanceChart: React.FC<DominanceChartProps> = ({
  data,
  height = 400,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data.points}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 12, fill: '#999' }}
            minTickGap={50}
          />
          <YAxis
            tickFormatter={formatYAxis}
            domain={[0, 1]}
            tick={{ fontSize: 12, fill: '#999' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: 10,
              bottom: 0,
              opacity: 0.8
            }}
          />

          {data.coins.map((coin) => (
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
    </div>
  );
};

export default DominanceChart;
