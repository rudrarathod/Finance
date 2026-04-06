import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface CategoryChartProps {
  data: { name: string; value: number }[];
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  return (
    <div className="h-24 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" hide />
          <Tooltip cursor={{ fill: 'transparent' }} />
          <Bar dataKey="value" fill="#a1a1aa" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
