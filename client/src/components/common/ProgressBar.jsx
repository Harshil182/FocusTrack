import clsx from "clsx";

// Reusable progress bar — used for goal completion progress.
export default function ProgressBar({ percent, complete }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
      <div
        className={clsx("h-full rounded-full transition-all", complete ? "bg-green-500" : "bg-brand-600")}
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  );
}
