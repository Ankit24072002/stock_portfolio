import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useStock } from "../context/StockContext";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const StockComparison = () => {
  const { token } = useAuth();
  const { searchStocks, getStockDetails } = useStock();
  const navigate = useNavigate();
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [stockDetails, setStockDetails] = useState({});

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchStocks(query);
      setSearchResults(results);
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    }
  };

  const addStockToComparison = async (stock) => {
    if (selectedStocks.length >= 4) {
      alert("Maximum 4 stocks can be compared at once");
      return;
    }

    if (selectedStocks.find(s => s.symbol === stock.symbol)) {
      return; // Already added
    }

    setSelectedStocks([...selectedStocks, stock]);

    // Load detailed data
    try {
      const details = await getStockDetails(stock.symbol);
      setStockDetails(prev => ({ ...prev, [stock.symbol]: details }));
    } catch (err) {
      console.error("Failed to load stock details:", err);
    }
  };

  const removeStockFromComparison = (symbol) => {
    setSelectedStocks(selectedStocks.filter(s => s.symbol !== symbol));
    setStockDetails(prev => {
      const newDetails = { ...prev };
      delete newDetails[symbol];
      return newDetails;
    });
  };

  const getChangeColor = (change) => {
    return change >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Stock Comparison</h1>
          <p className="text-gray-600">Compare up to 4 stocks side by side to make informed investment decisions.</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Stocks to Compare</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search for stocks..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              className="flex-1 rounded-3xl border border-slate-300 px-4 py-3 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 outline-none"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="mt-4 max-h-60 overflow-y-auto border border-slate-200 rounded-lg">
              {searchResults.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                  onClick={() => addStockToComparison(stock)}
                >
                  <div>
                    <p className="font-semibold text-slate-900">{stock.symbol}</p>
                    <p className="text-sm text-slate-600">{stock.name}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Add to Compare
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Stocks */}
        {selectedStocks.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Comparing Stocks</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedStocks.map((stock) => (
                <div key={stock.symbol} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  <span>{stock.symbol}</span>
                  <button
                    onClick={() => removeStockFromComparison(stock.symbol)}
                    className="text-blue-600 hover:text-blue-800 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comparison Table */}
        {selectedStocks.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-slate-900 font-semibold">Metric</th>
                    {selectedStocks.map((stock) => (
                      <th key={stock.symbol} className="px-6 py-4 text-slate-900 font-semibold text-center">
                        {stock.symbol}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="px-6 py-4 font-medium text-slate-900">Company Name</td>
                    {selectedStocks.map((stock) => (
                      <td key={stock.symbol} className="px-6 py-4 text-center">
                        {stockDetails[stock.symbol]?.name || stock.name}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">Current Price</td>
                    {selectedStocks.map((stock) => (
                      <td key={stock.symbol} className="px-6 py-4 text-center font-semibold">
                        ${stockDetails[stock.symbol]?.price?.toFixed(2) || "Loading..."}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-6 py-4 font-medium text-slate-900">Change (%)</td>
                    {selectedStocks.map((stock) => (
                      <td key={stock.symbol} className={`px-6 py-4 text-center font-semibold ${getChangeColor(stockDetails[stock.symbol]?.change)}`}>
                        {stockDetails[stock.symbol]?.change?.toFixed(2) || "0.00"}%
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">Market Cap</td>
                    {selectedStocks.map((stock) => (
                      <td key={stock.symbol} className="px-6 py-4 text-center">
                        ${(stockDetails[stock.symbol]?.marketCap / 1000000000)?.toFixed(2)}B
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-6 py-4 font-medium text-slate-900">P/E Ratio</td>
                    {selectedStocks.map((stock) => (
                      <td key={stock.symbol} className="px-6 py-4 text-center">
                        {stockDetails[stock.symbol]?.peRatio?.toFixed(2) || "N/A"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">EPS</td>
                    {selectedStocks.map((stock) => (
                      <td key={stock.symbol} className="px-6 py-4 text-center">
                        ${stockDetails[stock.symbol]?.eps?.toFixed(2) || "N/A"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-6 py-4 font-medium text-slate-900">Dividend Yield</td>
                    {selectedStocks.map((stock) => (
                      <td key={stock.symbol} className="px-6 py-4 text-center">
                        {stockDetails[stock.symbol]?.dividendYield?.toFixed(2)}%
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">Beta</td>
                    {selectedStocks.map((stock) => (
                      <td key={stock.symbol} className="px-6 py-4 text-center">
                        {stockDetails[stock.symbol]?.beta?.toFixed(2) || "N/A"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-slate-900">Volume</td>
                    {selectedStocks.map((stock) => (
                      <td key={stock.symbol} className="px-6 py-4 text-center">
                        {(stockDetails[stock.symbol]?.volume / 1000000)?.toFixed(1)}M
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedStocks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Search and add stocks above to start comparing</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockComparison;