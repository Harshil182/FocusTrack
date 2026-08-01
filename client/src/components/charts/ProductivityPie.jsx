import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Pie chart: productive vs unproductive time split.
export default function ProductivityPie({ productiveSeconds, unproductiveSeconds }) {
  const data = [
    { name: "Productive", value: productiveSeconds, color: "#4f46e5" },
    { name: "Unproductive", value: unproductiveSeconds, color: "#e5e7eb" },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={2}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => `${Math.round(v / 60)} min`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
