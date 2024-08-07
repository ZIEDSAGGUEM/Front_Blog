import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface LinearCurveGraphProps {
  data: {
    userId: string;
    username: string;
    postCount: number;
    maxLikes: number;
    totalLikes: number;
  }[];
}

const LinearCurveGraph: React.FC<LinearCurveGraphProps> = ({ data }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="username" />
          <YAxis domain={[0, "dataMax"]} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="postCount"
            stroke="#8884d8"
            name="Post Count"
          />
          <Line
            type="monotone"
            dataKey="totalLikes"
            stroke="#82ca9d"
            name="Total Likes"
          />
          <Line
            type="monotone"
            dataKey="maxLikes"
            stroke="#ffc658"
            name="Max Likes"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LinearCurveGraph;
