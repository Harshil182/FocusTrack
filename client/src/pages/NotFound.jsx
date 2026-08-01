import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 text-center">
      <h1 className="text-4xl font-bold text-brand-600">404</h1>
      <p className="text-gray-500">Page not found.</p>
      <Link to="/dashboard" className="mt-4 text-sm font-medium text-brand-600">Back to Dashboard</Link>
    </div>
  );
}
