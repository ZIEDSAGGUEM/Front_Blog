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

interface CurveGraphProps {
  data: {
    username: string;
    postCount: number;
  }[];
}

const CurveGraph: React.FC<CurveGraphProps> = ({ data }) => {
  // Prepare data for linear curve f(x) = ax
  const linearData = data.map((d, index) => ({
    x: index + 1,
    y: d.postCount,
  }));

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">User Posts Linear Graph</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={linearData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="x"
            label={{
              value: "Index",
              position: "insideBottomRight",
              offset: -5,
            }}
          />
          <YAxis
            label={{ value: "Post Count", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="y"
            stroke="#8884d8"
            name="Post Count"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CurveGraph;
