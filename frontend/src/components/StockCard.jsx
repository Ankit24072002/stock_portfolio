import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useStock } from "../context/StockContext";

const StockCard = ({ stock }) => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { fetchWatchlist } = useStock();

  const addToWatchlist = async (e) => {
    e.stopPropagation();
    try {
      await api.post("/watchlist/add", { stockSymbol: stock.symbol });
      if (token) fetchWatchlist(token);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to watchlist");
    }
  };

  return (
    <div
      onClick={() => navigate(`/stock/${stock.symbol}`)}
      className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{stock.symbol}</h3>
          <p className="text-gray-600 text-sm">{stock.name}</p>
        </div>
        <button
          onClick={addToWatchlist}
          className="text-yellow-500 hover:text-yellow-600 text-xl"
        >
          ⭐
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-bold text-blue-600">${stock.price.toFixed(2)}</p>
        <p className={`text-lg font-semibold ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
          {stock.change >= 0 ? "+" : ""}
          {stock.change.toFixed(2)}%
        </p>
      </div>

      <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
        View Details
      </button>
    </div>
  );
};

export default StockCard;
