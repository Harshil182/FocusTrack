import { useEffect, useState } from "react";
import { subDays, format } from "date-fns";
import Card from "../components/common/Card.jsx";
import Spinner from "../components/common/Spinner.jsx";
import TrendLineChart from "../components/charts/TrendLineChart.jsx";
import HeatmapCalendar from "../components/charts/HeatmapCalendar.jsx";
import UsageBarChart from "../components/charts/UsageBarChart.jsx";
import { trackingService } from "../services/trackingService.js";

const RANGES = [
  { label: "7 Days", days: 7 },
  { label: "30 Days", days: 30 },
  { label: "90 Days", days: 90 },
];

// Analytics page — Daily/Weekly/Monthly reports, trend line, heatmap,
// and top-sites breakdown for the selected range.
export default function Analytics() {
  const [rangeDays, setRangeDays] = useState(7);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const end = format(new Date(), "yyyy-MM-dd");
    const start = format(subDays(new Date(), rangeDays), "yyyy-MM-dd");
    trackingService
      .getByRange(start, end)
      .then(({ data }) => setEntries(data))
      .finally(() => setLoading(false));
  }, [rangeDays]);

  // Aggregate minutes per day for the trend line.
  const byDate = {};
  entries.forEach((e) => {
    byDate[e.date] = (byDate[e.date] || 0) + e.durationSeconds;
  });
  const trendData = Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, seconds]) => ({ date: date.slice(5), minutes: Math.round(seconds / 60) }));

  const heatmapData = Object.fromEntries(Object.entries(byDate).map(([d, s]) => [d, Math.round(s / 60)]));

  // Aggregate minutes per domain for the bar chart.
  const byDomain = {};
  entries.forEach((e) => {
    byDomain[e.domain] = (byDomain[e.domain] || 0) + e.durationSeconds;
  });
  const topSites = Object.entries(byDomain)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([domain, seconds]) => ({ domain, minutes: Math.round(seconds / 60) }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Analytics</h1>
        <div className="flex gap-2">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setRangeDays(r.days)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                rangeDays === r.days ? "bg-brand-600 text-white" : "border border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-300"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner size={28} />
        </div>
      ) : (
        <>
          <Card title="Screen Time Trend">
            {trendData.length > 0 ? <TrendLineChart data={trendData} /> : <p className="py-10 text-center text-sm text-gray-400">No data for this range.</p>}
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title="Top Websites">
              {topSites.length > 0 ? <UsageBarChart data={topSites} /> : <p className="py-10 text-center text-sm text-gray-400">No data.</p>}
            </Card>
            <Card title="Activity Heatmap">
              <HeatmapCalendar data={heatmapData} weeks={Math.ceil(rangeDays / 7)} />
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
