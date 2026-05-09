import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePortfolio } from "../context/PortfolioContext";
import { useStock } from "../context/StockContext";
import Navbar from "../components/Navbar";
import StockChart from "../components/StockChart";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, token } = useAuth();
  const { portfolio, fetchPortfolio } = usePortfolio();
  const { topMovers, getTopMovers, getStockDetails, getMarketIndices, getSectorPerformance, marketIndices, sectorPerformance } = useStock();
  const navigate = useNavigate();
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [featuredDetails, setFeaturedDetails] = useState(null);
  const [featuredSymbol, setFeaturedSymbol] = useState("AAPL");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchPortfolio(token);
    getTopMovers();
    getMarketIndices();
    getSectorPerformance();
  }, [token, navigate, fetchPortfolio, getTopMovers, getMarketIndices, getSectorPerformance]);

  useEffect(() => {
    const selectedSymbol = topMovers.length > 0 ? topMovers[0].symbol : "AAPL";
    setFeaturedSymbol(selectedSymbol);
  }, [topMovers]);

  useEffect(() => {
    const loadFeatured = async () => {
      if (!featuredSymbol) return;
      const details = await getStockDetails(featuredSymbol);
      setFeaturedDetails(details);
    };
    loadFeatured();
  }, [featuredSymbol, getStockDetails]);

  useEffect(() => {
    const invested = portfolio.reduce((sum, stock) => sum + stock.avgPrice * stock.quantity, 0);
    const value = portfolio.reduce((sum, stock) => sum + (stock.currentPrice || stock.avgPrice) * stock.quantity, 0);
    setTotalInvested(invested);
    setTotalValue(value);
  }, [portfolio]);

  const profitLoss = totalValue - totalInvested;
  const profitLossPercent = totalInvested > 0 ? ((profitLoss / totalInvested) * 100).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <section className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-8 text-white shadow-2xl shadow-slate-500/10 mb-10 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.35),_transparent_35%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.9fr] items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-200/70 mb-3">Market snapshot</p>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">Your stock portfolio</h1>
              <p className="mt-4 max-w-2xl text-slate-300 text-lg leading-8">
                Stay on top of your investments with live market movers, portfolio performance, and quick access to search and watchlist tools.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                <div className="rounded-3xl bg-slate-950/70 border border-white/10 p-5">
                  <p className="text-sm text-cyan-200 uppercase tracking-[0.24em]">Portfolio value</p>
                  <p className="mt-3 text-3xl font-semibold">${totalValue.toFixed(2)}</p>
                  <p className={`mt-2 text-sm ${profitLoss >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                    {profitLoss >= 0 ? "+" : ""}${profitLoss.toFixed(2)} ({profitLossPercent}%) this portfolio
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-950/70 border border-white/10 p-5">
                  <p className="text-sm text-cyan-200 uppercase tracking-[0.24em]">Available balance</p>
                  <p className="mt-3 text-3xl font-semibold">${user?.balance?.toFixed(2)}</p>
                  <p className="mt-2 text-sm text-slate-300">Ready to invest in your next stock idea.</p>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 shadow-xl shadow-slate-950/20">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/80">Watchlist update</p>
                  <h2 className="mt-2 text-2xl font-semibold">Top movers</h2>
                </div>
                <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                  Live</span>
              </div>
              <div className="space-y-3">
                {topMovers.slice(0, 4).map((stock) => (
                  <div key={stock.symbol} className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-400">{stock.name}</p>
                        <p className="text-lg font-semibold">{stock.symbol}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-semibold">${stock.price.toFixed(2)}</p>
                        <p className={`text-sm ${stock.change >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                          {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/85 p-6 shadow-2xl shadow-slate-950/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/70">Featured stock</p>
                <h3 className="text-2xl font-semibold text-white">{featuredDetails?.symbol || featuredSymbol}</h3>
              </div>
              <button
                onClick={() => setFeaturedSymbol(topMovers.length > 1 ? topMovers[1].symbol : "AAPL")}
                className="rounded-full border border-cyan-300/40 bg-white/5 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-white/10"
              >
                Swap stock
              </button>
            </div>
            <div className="rounded-3xl bg-slate-900/90 p-4">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-slate-400">{featuredDetails?.name || "Loading stock details..."}</p>
                  <p className="text-3xl font-semibold text-white">${featuredDetails?.price?.toFixed(2) || "--"}</p>
                </div>
                <div className={`rounded-2xl px-3 py-2 text-sm font-semibold ${featuredDetails?.change >= 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                  {featuredDetails?.change >= 0 ? "+" : ""}{featuredDetails?.change?.toFixed(2) || "0.00"}%
                </div>
              </div>
              {featuredDetails?.chartData ? (
                <div className="h-52">
                  <StockChart chartData={featuredDetails.chartData} />
                </div>
              ) : (
                <p className="text-sm text-slate-400">Chart data unavailable.</p>
              )}
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Invested</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">${totalInvested.toFixed(2)}</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Portfolio value</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">${totalValue.toFixed(2)}</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Weekly change</p>
                <p className={`mt-4 text-3xl font-semibold ${profitLoss >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {profitLoss >= 0 ? "+" : ""}{profitLossPercent}%
                </p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Balance</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">${user?.balance?.toFixed(2)}</p>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Market Movers</h2>
                  <p className="text-sm text-slate-500">A quick glance at the biggest movers in your universe.</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {topMovers.length === 0 ? (
                  <p className="text-slate-600">No movers available. Try again later.</p>
                ) : (
                  topMovers.map((stock) => (
                    <div key={stock.symbol} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm text-slate-500">{stock.symbol}</p>
                          <p className="font-semibold text-slate-900">{stock.name}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stock.change >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                          {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                        </span>
                      </div>
                      <p className="text-2xl font-semibold text-slate-900">${stock.price.toFixed(2)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">Portfolio snapshot</h2>
              <div className="space-y-4">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Total holdings</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{portfolio.length}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Top stock</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">{portfolio[0]?.stockSymbol || "N/A"}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">Quick actions</h2>
              <div className="space-y-3">
                <button onClick={() => navigate("/search")} className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Search stocks
                </button>
                <button onClick={() => navigate("/watchlist")} className="w-full rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                  View watchlist
                </button>
              </div>
            </div>
          </aside>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-semibold mb-4 text-slate-900">Your Holdings</h2>
          {portfolio.length === 0 ? (
            <p className="text-slate-600">No stocks in portfolio. Start by searching and buying stocks!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-200 text-slate-900">
                  <tr>
                    <th className="px-4 py-3">Symbol</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Avg Price</th>
                    <th className="px-4 py-3">Current Price</th>
                    <th className="px-4 py-3">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((stock) => (
                    <tr key={stock._id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-4 font-semibold text-slate-900">{stock.stockSymbol}</td>
                      <td className="px-4 py-4">{stock.quantity}</td>
                      <td className="px-4 py-4">${stock.avgPrice.toFixed(2)}</td>
                      <td className="px-4 py-4">${(stock.currentPrice || stock.avgPrice).toFixed(2)}</td>
                      <td className="px-4 py-4">${((stock.currentPrice || stock.avgPrice) * stock.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900">Market Indices</h2>
            <div className="space-y-4">
              {marketIndices.length === 0 ? (
                <p className="text-slate-600">Market data loading...</p>
              ) : (
                marketIndices.map((index) => (
                  <div key={index.symbol} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500">{index.symbol}</p>
                        <p className="font-semibold text-slate-900">{index.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-semibold text-slate-900">${index.price.toFixed(2)}</p>
                        <p className={`text-sm ${index.change >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          {index.change >= 0 ? "+" : ""}{index.change.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900">Sector Performance</h2>
            <div className="space-y-3">
              {sectorPerformance.length === 0 ? (
                <p className="text-slate-600">Sector data loading...</p>
              ) : (
                sectorPerformance.slice(0, 8).map((sector) => (
                  <div key={sector.name} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">{sector.name}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${sector.change >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {sector.change >= 0 ? "+" : ""}{sector.change.toFixed(2)}%
                      </span>
                      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${sector.change >= 0 ? "bg-emerald-500" : "bg-rose-500"}`}
                          style={{ width: `${Math.min(Math.abs(sector.change) * 10, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
