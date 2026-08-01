import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

// Line chart: total screen time trend over the last N days.
export default function TrendLineChart({ data }) {
  // data: [{ date, minutes }]
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tickFormatter={(v) => `${v}m`} tick={{ fontSize: 11 }} />
        <Tooltip formatter={(v) => `${v} min`} />
        <Line type="monotone" dataKey="minutes" stroke="#4f46e5" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
