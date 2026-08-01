import clsx from "clsx";

// Generic card container — the base building block of the entire
// dashboard (stat cards, chart panels, goal cards, settings sections).
export default function Card({ children, className, title, action }) {
  return (
    <div className={clsx("rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
