import clsx from "clsx";

// Reusable button — used across auth forms, dashboard actions, settings, etc.
export default function Button({ children, variant = "primary", className, ...props }) {
  return (
    <button
      className={clsx(
        "rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50",
        variant === "primary" && "bg-brand-600 text-white hover:bg-brand-700",
        variant === "secondary" && "border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
