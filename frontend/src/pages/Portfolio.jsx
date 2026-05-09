import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { usePortfolio } from "../context/PortfolioContext";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Portfolio = () => {
  const { token } = useAuth();
  const { portfolio, transactions, fetchPortfolio, fetchTransactions } = usePortfolio();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchPortfolio(token);
      fetchTransactions(token);
    }
  }, [token, navigate, fetchPortfolio, fetchTransactions]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Portfolio</h1>

        {/* Holdings Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Current Holdings</h2>
          {portfolio.length === 0 ? (
            <p className="text-gray-600">No holdings yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Symbol</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                    <th className="px-4 py-2 text-left">Avg Price</th>
                    <th className="px-4 py-2 text-left">Total Investment</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((stock) => (
                    <tr key={stock._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 font-semibold">{stock.stockSymbol}</td>
                      <td className="px-4 py-2">{stock.quantity}</td>
                      <td className="px-4 py-2">${stock.avgPrice.toFixed(2)}</td>
                      <td className="px-4 py-2">${(stock.avgPrice * stock.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Transaction History</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-600">No transactions yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Symbol</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Total</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 font-semibold">{tx.stockSymbol}</td>
                      <td className={`px-4 py-2 font-semibold ${tx.type === "BUY" ? "text-green-600" : "text-red-600"}`}>
                        {tx.type}
                      </td>
                      <td className="px-4 py-2">{tx.quantity}</td>
                      <td className="px-4 py-2">${tx.price.toFixed(2)}</td>
                      <td className="px-4 py-2">${tx.totalAmount.toFixed(2)}</td>
                      <td className="px-4 py-2">{new Date(tx.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
