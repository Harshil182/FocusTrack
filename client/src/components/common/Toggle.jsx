import clsx from "clsx";

// Reusable on/off switch — used for dark mode & notification settings.
export default function Toggle({ checked, onChange, label }) {
  return (
    <div className="flex items-center justify-between py-2">
      {label && <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>}
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={clsx("relative h-6 w-11 rounded-full transition-colors", checked ? "bg-brand-600" : "bg-gray-300 dark:bg-gray-700")}
      >
        <span className={clsx("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-5" : "translate-x-0.5")} />
      </button>
    </div>
  );
}
