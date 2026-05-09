import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useStock } from "../context/StockContext";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const Watchlist = () => {
  const { token } = useAuth();
  const { watchlist, fetchWatchlist } = useStock();
  const navigate = useNavigate();
  const [watchlistDetails, setWatchlistDetails] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchWatchlist(token);
    }
  }, [token, navigate, fetchWatchlist]);

  useEffect(() => {
    const fetchDetails = async () => {
      const details = await Promise.all(
        watchlist.map(async (item) => {
          const response = await api.get(`/stocks/${item.stockSymbol}`);
          return response.data;
        })
      );
      setWatchlistDetails(details);
    };

    if (watchlist.length > 0) {
      fetchDetails();
    }
  }, [watchlist]);

  const removeFromWatchlist = async (symbol) => {
    try {
      await api.post("/watchlist/remove", { stockSymbol: symbol });
      fetchWatchlist(token);
    } catch (err) {
      console.error("Failed to remove from watchlist:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Watchlist</h1>

        {watchlist.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">No stocks in watchlist</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlistDetails.map((stock) => (
              <div key={stock.symbol} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{stock.symbol}</h3>
                    <p className="text-gray-600 text-sm">{stock.name}</p>
                  </div>
                  <button
                    onClick={() => removeFromWatchlist(stock.symbol)}
                    className="text-red-600 hover:text-red-800 font-semibold text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-2xl font-bold text-blue-600">${stock.price.toFixed(2)}</p>
                  <p className={`text-lg font-semibold ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {stock.change >= 0 ? "+" : ""}
                    {stock.change.toFixed(2)}%
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/stock/${stock.symbol}`)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
