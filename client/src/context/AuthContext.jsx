import { createContext, useContext, useEffect, useState } from "react";
import api, { setToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    setToken(token);
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [token]);

  const login = (payload) => {
    localStorage.setItem("token", payload.token);
    setToken(payload.token);
    setTokenState(payload.token);
    setUser(payload.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setTokenState(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, token, loading, login, logout, setUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
