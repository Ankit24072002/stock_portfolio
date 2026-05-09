import React, { createContext, useContext, useState, useCallback } from "react";
import api from "../api/api";

const StockContext = createContext();

export const StockProvider = ({ children }) => {
  const [stocks, setStocks] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [topMovers, setTopMovers] = useState([]);
  const [marketIndices, setMarketIndices] = useState([]);
  const [sectorPerformance, setSectorPerformance] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchStocks = useCallback(async (query) => {
    try {
      setLoading(true);
      const response = await api.get("/stocks/search", { params: { query } });
      setStocks(response.data);
      return response.data;
    } catch (err) {
      console.error("Failed to search stocks:", err);
      setStocks([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllStocks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/stocks/all");
      setStocks(response.data);
    } catch (err) {
      console.error("Failed to fetch stocks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getTopMovers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/stocks/top-movers");
      setTopMovers(response.data);
    } catch (err) {
      console.error("Failed to fetch top movers:", err);
      setTopMovers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getStockDetails = useCallback(async (symbol) => {
    try {
      const response = await api.get(`/stocks/${symbol}`);
      return response.data;
    } catch (err) {
      console.error("Failed to fetch stock details:", err);
      return null;
    }
  }, []);

  const getStockChart = useCallback(async (symbol, period = "1M") => {
    try {
      const response = await api.get(`/stocks/chart/${symbol}/${period}`);
      return response.data;
    } catch (err) {
      console.error("Failed to fetch stock chart:", err);
      return [];
    }
  }, []);

  const getMarketIndices = useCallback(async () => {
    try {
      const response = await api.get("/stocks/indices");
      setMarketIndices(response.data);
      return response.data;
    } catch (err) {
      console.error("Failed to fetch market indices:", err);
      return [];
    }
  }, []);

  const getSectorPerformance = useCallback(async () => {
    try {
      const response = await api.get("/stocks/sectors");
      setSectorPerformance(response.data);
      return response.data;
    } catch (err) {
      console.error("Failed to fetch sector performance:", err);
      return [];
    }
  }, []);

  const fetchWatchlist = useCallback(async (token) => {
    try {
      const response = await api.get("/watchlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWatchlist(response.data);
    } catch (err) {
      console.error("Failed to fetch watchlist:", err);
    }
  }, []);

  return (
    <StockContext.Provider
      value={{
        stocks,
        watchlist,
        topMovers,
        marketIndices,
        sectorPerformance,
        loading,
        searchStocks,
        getAllStocks,
        getTopMovers,
        getStockDetails,
        getStockChart,
        getMarketIndices,
        getSectorPerformance,
        fetchWatchlist
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error("useStock must be used within StockProvider");
  }
  return context;
};
