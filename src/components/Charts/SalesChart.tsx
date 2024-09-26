import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../Cards";

interface SalesChartProps {
  data: { date: Date; amount: number }[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sortedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  `${date.getDate()}/${date.getMonth() + 1}`
                }
                interval={Math.ceil(sortedData.length / 10) - 1}
              />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
