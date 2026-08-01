import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Bar chart: minutes spent per website domain (top N).
export default function UsageBarChart({ data }) {
  // data: [{ domain, minutes }]
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tickFormatter={(v) => `${v}m`} />
        <YAxis type="category" dataKey="domain" width={100} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v) => `${v} min`} />
        <Bar dataKey="minutes" fill="#4f46e5" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
