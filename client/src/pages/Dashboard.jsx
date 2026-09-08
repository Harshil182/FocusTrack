import { useEffect, useState } from "react";
import { Clock, Zap, TrendingUp, Globe } from "lucide-react";
import Card from "../components/common/Card.jsx";
import StatCard from "../components/common/StatCard.jsx";
import Spinner from "../components/common/Spinner.jsx";
import ProductivityPie from "../components/charts/ProductivityPie.jsx";
import UsageBarChart from "../components/charts/UsageBarChart.jsx";
import { trackingService } from "../services/trackingService.js";
import { formatDuration, productivityScore } from "../utils/format.js";

// Overview page — the default landing page after login.
export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackingService
      .getTodaySummary()
      .then(({ summary }) => setSummary(summary))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  const totalSeconds = summary?.totalSeconds || 0;
  const productiveSeconds = summary?.productiveSeconds || 0;
  const unproductiveSeconds = summary?.unproductiveSeconds || 0;

  const topSites = (summary?.entries || [])
    .slice()
    .sort((a, b) => b.durationSeconds - a.durationSeconds)
    .slice(0, 6)
    .map((e) => ({ domain: e.domain, minutes: Math.max(1, Math.round(e.durationSeconds / 60)) }));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Today's Overview</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Screen Time" value={formatDuration(totalSeconds)} icon={Clock} />
        <StatCard label="Productive Time" value={formatDuration(productiveSeconds)} icon={Zap} accent="green" />
        <StatCard label="Productivity Score" value={`${productivityScore(productiveSeconds, totalSeconds)}%`} icon={TrendingUp} />
        <StatCard label="Sites Visited" value={summary?.entries?.length || 0} icon={Globe} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Productive vs Unproductive">
          <ProductivityPie productiveSeconds={productiveSeconds} unproductiveSeconds={unproductiveSeconds} />
        </Card>
        <Card title="Most Visited Websites">
          {topSites.length > 0 ? (
            <UsageBarChart data={topSites} />
          ) : (
            <p className="py-10 text-center text-sm text-gray-400">No activity tracked yet today.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
