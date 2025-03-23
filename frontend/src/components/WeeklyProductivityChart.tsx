"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const WeeklyProductivityChart = ({ data }) => {
  const totalHours = data.reduce((sum, d) => sum + d.hours, 0).toFixed(1);

  return (
    <div className="bg-white rounded-2xl p-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-zinc-800">
        </h2>
        <p className="text-sm text-zinc-500">
          Total: <span className="font-semibold">{totalHours} hours</span>
        </p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="day" />
          <YAxis unit="h" />
          {/* <Tooltip formatter={(value) => `${value} hrs`} /> */}
          <Bar dataKey="hours" fill="#52525C" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyProductivityChart;
