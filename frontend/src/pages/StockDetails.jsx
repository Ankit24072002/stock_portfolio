import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useStock } from "../context/StockContext";
import Navbar from "../components/Navbar";
import StockChart from "../components/StockChart";
import BuySellForm from "../components/BuySellForm";
import TechnicalIndicators from "../components/TechnicalIndicators";

const StockDetails = () => {
  const { symbol } = useParams();
  const { token } = useAuth();
  const { getStockDetails, getStockChart } = useStock();
  const navigate = useNavigate();
  const [stock, setStock] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("1M");
  const [loading, setLoading] = useState(true);

  const loadStockDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getStockDetails(symbol);
      if (data) {
        setStock(data);
        setChartData(data.chartData || []);
      }
    } catch (err) {
      console.error("Failed to load stock:", err);
    } finally {
      setLoading(false);
    }
  }, [symbol, getStockDetails]);

  const loadChartData = useCallback(async (period) => {
    try {
      const data = await getStockChart(symbol, period);
      setChartData(data);
    } catch (err) {
      console.error("Failed to load chart data:", err);
    }
  }, [symbol, getStockChart]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      loadStockDetails();
    }
  }, [symbol, token, navigate, loadStockDetails]);

  useEffect(() => {
    if (stock) {
      loadChartData(selectedPeriod);
    }
  }, [selectedPeriod, stock, loadChartData]);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Stock not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate("/search")}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Search
          </button>
          <h1 className="text-4xl font-bold text-gray-800">
            {stock.symbol} - {stock.name}
          </h1>
          {stock.description && (
            <p className="mt-2 text-gray-600 max-w-2xl">{stock.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Current Price</p>
                  <p className="text-4xl font-bold text-blue-600">${stock.price.toFixed(2)}</p>
                  <p className={`text-lg ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {stock.change >= 0 ? "+" : ""}
                    {stock.change.toFixed(2)}%
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="font-semibold text-slate-800">Open</p>
                    <p>${stock.open?.toFixed(2) || "0.00"}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="font-semibold text-slate-800">Prev Close</p>
                    <p>${stock.previousClose?.toFixed(2) || "0.00"}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="font-semibold text-slate-800">High</p>
                    <p>${stock.high?.toFixed(2) || "0.00"}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-100 p-4">
                    <p className="font-semibold text-slate-800">Low</p>
                    <p>${stock.low?.toFixed(2) || "0.00"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Price Chart</h2>
                <div className="flex gap-2">
                  {["1D", "1W", "1M", "3M", "6M", "1Y"].map((period) => (
                    <button
                      key={period}
                      onClick={() => handlePeriodChange(period)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        selectedPeriod === period
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <StockChart chartData={chartData} />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Key Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Market Cap</p>
                  <p className="text-lg font-semibold text-slate-900">
                    ${(stock.marketCap / 1000000000)?.toFixed(2)}B
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">P/E Ratio</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {stock.peRatio?.toFixed(2) || "N/A"}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">EPS</p>
                  <p className="text-lg font-semibold text-slate-900">
                    ${stock.eps?.toFixed(2) || "N/A"}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Dividend Yield</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {stock.dividendYield?.toFixed(2)}%
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Beta</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {stock.beta?.toFixed(2) || "N/A"}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Volume</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {(stock.volume / 1000000)?.toFixed(1)}M
                  </p>
                </div>
              </div>
            </div>

            <TechnicalIndicators chartData={chartData} />

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Latest News</h2>
                <span className="text-sm text-slate-500">{stock.news?.length || 0} stories</span>
              </div>
              {stock.news && stock.news.length > 0 ? (
                <div className="space-y-4">
                  {stock.news.map((item, index) => (
                    <a
                      key={`${item.headline}-${index}`}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300"
                    >
                      <p className="font-semibold text-slate-900">{item.headline}</p>
                      <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
                        <span>{item.source}</span>
                        <span>{item.datetime}</span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No news available for this symbol.</p>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <BuySellForm stock={stock} onSuccess={loadStockDetails} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetails;
