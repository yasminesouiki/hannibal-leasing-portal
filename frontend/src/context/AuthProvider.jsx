import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, token: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setAuth({ token: storedToken, user: JSON.parse(storedUser) });
    }
    setLoading(false);
  }, []);

  const login = (userData, userToken) => {
    setAuth({ user: userData, token: userToken });
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const isAuthenticated = !!auth.token;
  const role = auth.user?.role || null;

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        token: auth.token,
        login,
        logout,
        isAuthenticated,
        role,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};