import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const getStoredToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getStoredToken());
  const [rememberMe, setRememberMe] = useState(Boolean(localStorage.getItem("token")));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      return;
    }

    if (rememberMe) {
      localStorage.setItem("token", token);
      sessionStorage.removeItem("token");
    } else {
      sessionStorage.setItem("token", token);
      localStorage.removeItem("token");
    }
  }, [token, rememberMe]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = (userData, authToken, remember = false) => {
    setUser(userData);
    setToken(authToken);
    setRememberMe(remember);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRememberMe(false);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, rememberMe, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
