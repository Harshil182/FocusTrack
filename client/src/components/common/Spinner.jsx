// Reusable loading spinner used during API calls across the app.
export default function Spinner({ size = 20 }) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-gray-200 border-t-brand-600"
      style={{ width: size, height: size }}
    />
  );
}
