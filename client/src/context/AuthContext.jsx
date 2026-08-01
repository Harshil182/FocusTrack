import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService.js";

const AuthContext = createContext(null);

// Provides the current user + auth actions to the whole app.
// Wraps <App /> once at the top level (see App.jsx).
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("focustrack_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  // On first load, verify the stored token is still valid by fetching the profile.
  useEffect(() => {
    const token = localStorage.getItem("focustrack_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .getProfile()
      .then(({ user }) => setUser(user))
      .catch(() => {
        localStorage.removeItem("focustrack_token");
        localStorage.removeItem("focustrack_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { user, token } = await authService.login({ email, password });
    localStorage.setItem("focustrack_token", token);
    localStorage.setItem("focustrack_user", JSON.stringify(user));
    setUser(user);
  };

  const register = async (name, email, password) => {
    const { user, token } = await authService.register({ name, email, password });
    localStorage.setItem("focustrack_token", token);
    localStorage.setItem("focustrack_user", JSON.stringify(user));
    setUser(user);
  };

  const logout = async () => {
    await authService.logout().catch(() => {});
    localStorage.removeItem("focustrack_token");
    localStorage.removeItem("focustrack_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for consuming auth state anywhere in the tree.
export const useAuth = () => useContext(AuthContext);
