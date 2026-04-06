import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

interface TrendChartProps {
  data: { date: string; balance: number }[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  return (
    <div className="h-24 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <LineChart data={data}>
          <Line type="monotone" dataKey="balance" stroke="#18181b" strokeWidth={2} dot={false} />
          <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
