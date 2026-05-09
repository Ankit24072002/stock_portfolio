import React, { useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { usePortfolio } from "../context/PortfolioContext";

const BuySellForm = ({ stock, onSuccess }) => {
  const { token, user } = useAuth();
  const { fetchPortfolio } = usePortfolio();
  const [formData, setFormData] = useState({
    quantity: 1,
    type: "BUY",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const totalAmount = formData.quantity * stock.price;

      if (formData.type === "BUY" && user.balance < totalAmount) {
        setMessage("Insufficient balance!");
        setLoading(false);
        return;
      }

      const endpoint = formData.type === "BUY" ? "/portfolio/buy" : "/portfolio/sell";
      await api.post(endpoint, {
        stockSymbol: stock.symbol,
        quantity: parseInt(formData.quantity),
        price: stock.price,
      });

      setMessage(`${formData.type} successful!`);
      setFormData({ quantity: 1, type: "BUY" });

      if (token) {
        fetchPortfolio(token);
      }

      setTimeout(onSuccess, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Trade</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Type</label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "BUY" })}
              className={`flex-1 py-2 rounded font-semibold transition ${
                formData.type === "BUY"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              BUY
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "SELL" })}
              className={`flex-1 py-2 rounded font-semibold transition ${
                formData.type === "SELL"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              SELL
            </button>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
          <input
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <p className="text-gray-700 text-sm mb-2">Total Amount</p>
          <p className="text-2xl font-bold text-blue-600">
            ${(formData.quantity * stock.price).toFixed(2)}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-white transition ${
            formData.type === "BUY"
              ? "bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
              : "bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
          }`}
        >
          {loading ? "Processing..." : `${formData.type} ${stock.symbol}`}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded ${
            message.includes("successful")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default BuySellForm;
