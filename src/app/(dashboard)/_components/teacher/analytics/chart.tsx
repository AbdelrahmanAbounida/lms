"use client";
import { Card } from "@/components/ui/card";
import React from "react";
import { XAxis, ResponsiveContainer, BarChart, YAxis, Bar } from "recharts";

interface AnalyticsData {
  data: {
    name: string;
    total: number;
  }[];
}

const AnalyticsChart = ({ data }: AnalyticsData) => {
  return (
    <Card>
      <ResponsiveContainer width={"100%"} height={350}>
        <BarChart data={data}>
          <XAxis
            dataKey={"name"}
            stroke="black"
            fontSize={16}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Bar
            dataKey={"total"}
            fill="green"
            radius={[4, 4, 0, 0]}
            maxBarSize={100}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default AnalyticsChart;
