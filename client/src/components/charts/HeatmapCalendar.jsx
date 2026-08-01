import clsx from "clsx";

// Simple GitHub-style contribution heatmap.
// data: { "YYYY-MM-DD": minutes }
export default function HeatmapCalendar({ data = {}, weeks = 12 }) {
  const days = [];
  const today = new Date();
  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, minutes: data[key] || 0 });
  }

  const intensity = (m) => {
    if (m === 0) return "bg-gray-100 dark:bg-gray-800";
    if (m < 30) return "bg-brand-200 dark:bg-brand-900";
    if (m < 90) return "bg-brand-400 dark:bg-brand-700";
    if (m < 180) return "bg-brand-600 dark:bg-brand-500";
    return "bg-brand-800 dark:bg-brand-300";
  };

  return (
    <div className="grid grid-flow-col grid-rows-7 gap-1">
      {days.map((d) => (
        <div key={d.date} title={`${d.date}: ${d.minutes}m`} className={clsx("h-3 w-3 rounded-sm", intensity(d.minutes))} />
      ))}
    </div>
  );
}
