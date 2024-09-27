import React, { useState, useEffect } from "react";
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
  const [chartWidth, setChartWidth] = useState(0);
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  useEffect(() => {
    const updateWidth = () => {
      const chart = document.getElementById("sales-chart-container");
      if (chart) {
        setChartWidth(chart.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const getTickInterval = () => {
    if (chartWidth < 400) return Math.ceil(sortedData.length / 3) - 1;
    if (chartWidth < 600) return Math.ceil(sortedData.length / 5) - 1;
    return Math.ceil(sortedData.length / 10) - 1;
  };

  // Calculate the minimum width required to show all data points
  const minWidth = Math.max(sortedData.length * 50, 300); // 50px per data point, minimum 300px

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sales Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div id="sales-chart-container" className="w-full overflow-x-auto">
          <div
            style={{
              width: `${Math.max(minWidth, chartWidth)}px`,
              height: "400px",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sortedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.getDate()}/${d.getMonth() + 1}`;
                  }}
                  interval={getTickInterval()}
                  angle={-45}
                  textAnchor="end"
                  height={50}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
