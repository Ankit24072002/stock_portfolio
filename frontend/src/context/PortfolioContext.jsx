import React, { createContext, useContext, useState, useCallback } from "react";
import api from "../api/api";

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPortfolio = useCallback(async (token) => {
    try {
      setLoading(true);
      const response = await api.get("/portfolio", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolio(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch portfolio");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async (token) => {
    try {
      const response = await api.get("/portfolio/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  }, []);

  return (
    <PortfolioContext.Provider
      value={{ portfolio, transactions, loading, error, fetchPortfolio, fetchTransactions }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within PortfolioProvider");
  }
  return context;
};
