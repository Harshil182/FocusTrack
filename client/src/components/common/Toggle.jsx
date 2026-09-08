import clsx from "clsx";

// Reusable on/off switch — used for dark mode & notification settings.
export default function Toggle({ checked, onChange, label, compact = false, className }) {
  const trackClasses = clsx(
    "ml-4 inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
    compact ? "h-5 w-9 px-1" : "h-6 w-11 px-1",
    checked ? "bg-brand-600" : "bg-gray-300 dark:bg-gray-700"
  );

  const knobClasses = clsx(
    "rounded-full bg-white shadow transform transition-all",
    compact ? "h-4 w-4" : "h-5 w-5",
    checked ? "ml-auto" : "ml-0"
  );

  return (
    <div className={clsx("flex items-center", compact ? "py-1" : "py-2", className)}>
      {label && (
        <span
          className={clsx(
            "text-sm flex-1",
            compact ? "text-gray-700 dark:text-gray-200" : "text-gray-700 dark:text-gray-300"
          )}
        >
          {label}
        </span>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={!!checked}
        onClick={() => onChange(!checked)}
        className={trackClasses}
      >
        <span className={knobClasses} />
      </button>
    </div>
  );
}
