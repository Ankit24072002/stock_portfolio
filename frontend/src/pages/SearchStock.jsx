import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useStock } from "../context/StockContext";
import Navbar from "../components/Navbar";
import StockCard from "../components/StockCard";
import { useNavigate } from "react-router-dom";

const SearchStock = () => {
  const { token } = useAuth();
  const { stocks, loading, searchStocks, getAllStocks } = useStock();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      getAllStocks();
    }
  }, [token, navigate, getAllStocks]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim()) {
      searchStocks(e.target.value);
    } else {
      getAllStocks();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Search Stocks</h1>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by symbol or company name..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Stocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="col-span-full text-center text-gray-600">Loading stocks...</p>
          ) : stocks.length === 0 ? (
            <p className="col-span-full text-center text-gray-600">No stocks found</p>
          ) : (
            stocks.map((stock) => <StockCard key={stock.symbol} stock={stock} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchStock;
