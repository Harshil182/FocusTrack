// Static class map — Tailwind's JIT compiler can only detect classes that
// appear as complete strings in source, so dynamic `bg-${accent}-50`
// interpolation would get purged from the production build.
const ACCENTS = {
  brand: "bg-brand-50 text-brand-600 dark:bg-brand-900/40",
  green: "bg-green-50 text-green-600 dark:bg-green-900/40",
};

// Small stat display used across the Overview page (total time,
// productive time, productivity score, most visited site, etc.)
export default function StatCard({ label, value, icon: Icon, accent = "brand" }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</span>
        {Icon && (
          <span className={`rounded-lg p-1.5 ${ACCENTS[accent] || ACCENTS.brand}`}>
            <Icon size={16} />
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  );
}
