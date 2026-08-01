import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Wraps any page that requires authentication. Redirects to /login
// if there's no authenticated user once the initial auth check finishes.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-gray-400">Loading...</div>;
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}
