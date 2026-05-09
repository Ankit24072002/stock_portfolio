const axios = require("axios");
const config = require("../config/env");

const MOCK_STOCKS = {
  AAPL: { symbol: "AAPL", name: "Apple Inc.", price: 178.5, change: 2.5 },
  GOOGL: { symbol: "GOOGL", name: "Alphabet Inc.", price: 140.2, change: 1.2 },
  MSFT: { symbol: "MSFT", name: "Microsoft Corp.", price: 430.8, change: 3.1 },
  AMZN: { symbol: "AMZN", name: "Amazon.com Inc.", price: 185.4, change: -1.5 },
  TSLA: { symbol: "TSLA", name: "Tesla Inc.", price: 245.6, change: 5.2 },
  NFLX: { symbol: "NFLX", name: "Netflix Inc.", price: 410.5, change: 2.8 },
  META: { symbol: "META", name: "Meta Platforms Inc.", price: 320.3, change: 4.1 },
  NVDA: { symbol: "NVDA", name: "NVIDIA Corporation", price: 512.7, change: 6.3 },
};

const STOCK_API_KEY = config.STOCK_API_KEY;
const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const USE_STOCK_API = Boolean(STOCK_API_KEY);

const formatDate = (date) => date.toISOString().split("T")[0];

const makeMockChartData = (price) =>
  Array.from({ length: 30 }, (_, i) => ({
    date: formatDate(new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000)),
    price: Number((price + (Math.random() - 0.5) * 20).toFixed(2)),
  }));

const finnhubRequest = async (path, params = {}) => {
  const response = await axios.get(`${FINNHUB_BASE_URL}${path}`, {
    params: { ...params, token: STOCK_API_KEY },
    timeout: 10000,
  });
  return response.data;
};

const searchStocks = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    if (USE_STOCK_API) {
      try {
        const data = await finnhubRequest("/search", { q: query });
        const results = (data.result || [])
          .filter((item) => item.symbol && item.description)
          .map((item) => ({
            symbol: item.symbol,
            name: item.description,
            type: item.type || "Stock",
          }))
          .slice(0, 20);

        if (results.length) {
          return res.json(results);
        }
      } catch (err) {
        console.warn("Finnhub search failed, falling back to mock data", err.message);
      }
    }

    const results = Object.values(MOCK_STOCKS).filter(
      (stock) =>
        stock.symbol.toUpperCase().includes(query.toUpperCase()) ||
        stock.name.toUpperCase().includes(query.toUpperCase())
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Error searching stocks", error: err.message });
  }
};

const getStockPrice = async (req, res) => {
  try {
    const { symbol } = req.params;
    const upperSymbol = symbol.toUpperCase();

    if (USE_STOCK_API) {
      try {
        const quote = await finnhubRequest("/quote", { symbol: upperSymbol });
        const profile = await finnhubRequest("/stock/profile2", { symbol: upperSymbol });
        const metrics = await finnhubRequest("/stock/metric", { symbol: upperSymbol, metric: "all" });

        const to = Math.floor(Date.now() / 1000);
        const from = to - 60 * 60 * 24 * 30;
        const candleData = await finnhubRequest("/stock/candle", {
          symbol: upperSymbol,
          resolution: "D",
          from,
          to,
        });

        const newsData = await finnhubRequest("/company-news", {
          symbol: upperSymbol,
          from: formatDate(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)),
          to: formatDate(new Date()),
        });

        const recommendationData = await finnhubRequest("/stock/recommendation", { symbol: upperSymbol });

        const chartData =
          candleData?.s === "ok"
            ? candleData.t.map((timestamp, index) => ({
                date: formatDate(new Date(timestamp * 1000)),
                price: Number(candleData.c[index].toFixed(2)),
              }))
            : makeMockChartData(quote.c || 0);

        const news = Array.isArray(newsData)
          ? newsData.slice(0, 6).map((item) => ({
              headline: item.headline,
              source: item.source,
              url: item.url,
              datetime: item.datetime ? new Date(item.datetime * 1000).toLocaleDateString() : "",
            }))
          : [];

        const recommendations = Array.isArray(recommendationData)
          ? recommendationData.slice(0, 5).map((rec) => ({
              period: rec.period,
              strongBuy: rec.strongBuy,
              buy: rec.buy,
              hold: rec.hold,
              sell: rec.sell,
              strongSell: rec.strongSell,
            }))
          : [];

        return res.json({
          symbol: upperSymbol,
          name: profile.name || upperSymbol,
          description: profile.finnhubIndustry || profile.weburl || "Real-time market data",
          price: quote.c || 0,
          change: quote.dp || 0,
          changePercent: quote.dp || 0,
          high: quote.h || 0,
          low: quote.l || 0,
          open: quote.o || 0,
          previousClose: quote.pc || 0,
          volume: quote.v || 0,
          marketCap: metrics?.metric?.marketCapitalization || 0,
          peRatio: metrics?.metric?.peNormalizedAnnual || 0,
          dividendYield: metrics?.metric?.dividendYieldIndicatedAnnual || 0,
          beta: metrics?.metric?.beta || 0,
          eps: metrics?.metric?.epsNormalizedAnnual || 0,
          revenue: metrics?.metric?.revenuePerShareAnnual || 0,
          profitMargin: metrics?.metric?.profitMargin || 0,
          sector: profile.finnhubIndustry || "Unknown",
          country: profile.country || "Unknown",
          currency: profile.currency || "USD",
          exchange: profile.exchange || "Unknown",
          chartData,
          news,
          recommendations,
        });
      } catch (err) {
        console.warn("Finnhub quote failed, falling back to mock data", err.message);
      }
    }

    const stock = MOCK_STOCKS[upperSymbol];
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    const chartData = makeMockChartData(stock.price);
    res.json({
      ...stock,
      chartData,
      news: [],
      recommendations: [],
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      marketCap: Math.floor(Math.random() * 1000000000000) + 10000000000,
      peRatio: Math.random() * 50 + 5,
      dividendYield: Math.random() * 5,
      beta: Math.random() * 2 + 0.5,
      eps: Math.random() * 20 + 1,
      revenue: Math.random() * 100 + 10,
      profitMargin: Math.random() * 30 + 5,
      sector: "Technology",
      country: "United States",
      currency: "USD",
      exchange: "NASDAQ",
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stock price", error: err.message });
  }
};

const getTopMovers = async (req, res) => {
  try {
    const symbols = Object.keys(MOCK_STOCKS);

    if (USE_STOCK_API) {
      try {
        const requests = symbols.map((symbol) =>
          finnhubRequest("/quote", { symbol }).then((quote) => ({ symbol, quote }))
        );
        const quotes = await Promise.allSettled(requests);

        const results = quotes
          .map((result, index) => {
            const symbol = symbols[index];
            if (result.status !== "fulfilled" || !result.value?.quote) {
              const mock = MOCK_STOCKS[symbol];
              return {
                symbol,
                name: mock.name,
                price: mock.price,
                change: mock.change,
                changePercent: mock.change,
              };
            }
            const quote = result.value.quote;
            return {
              symbol,
              name: MOCK_STOCKS[symbol]?.name || symbol,
              price: quote.c || 0,
              change: quote.dp || 0,
              changePercent: quote.dp || 0,
            };
          })
          .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
          .slice(0, 8);

        return res.json(results);
      } catch (err) {
        console.warn("Finnhub top movers failed, falling back to mock movers", err.message);
      }
    }

    const results = Object.values(MOCK_STOCKS)
      .map((stock) => ({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: stock.change,
        changePercent: stock.change,
      }))
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, 8);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Error fetching top movers", error: err.message });
  }
};

const getAllStocks = async (req, res) => {
  try {
    res.json(Object.values(MOCK_STOCKS));
  } catch (err) {
    res.status(500).json({ message: "Error fetching stocks", error: err.message });
  }
};

const getStockChart = async (req, res) => {
  try {
    const { symbol, period = "1M" } = req.params;
    const upperSymbol = symbol.toUpperCase();

    const periodMap = {
      "1D": { days: 1, resolution: "5" },
      "1W": { days: 7, resolution: "15" },
      "1M": { days: 30, resolution: "D" },
      "3M": { days: 90, resolution: "D" },
      "6M": { days: 180, resolution: "D" },
      "1Y": { days: 365, resolution: "D" },
    };

    const { days, resolution } = periodMap[period] || periodMap["1M"];

    if (USE_STOCK_API) {
      try {
        const to = Math.floor(Date.now() / 1000);
        const from = to - 60 * 60 * 24 * days;
        const candleData = await finnhubRequest("/stock/candle", {
          symbol: upperSymbol,
          resolution,
          from,
          to,
        });

        if (candleData?.s === "ok") {
          const chartData = candleData.t.map((timestamp, index) => ({
            date: new Date(timestamp * 1000).toISOString().split("T")[0],
            price: Number(candleData.c[index].toFixed(2)),
            high: Number(candleData.h[index].toFixed(2)),
            low: Number(candleData.l[index].toFixed(2)),
            open: Number(candleData.o[index].toFixed(2)),
            volume: candleData.v[index],
          }));

          return res.json(chartData);
        }
      } catch (err) {
        console.warn("Finnhub chart failed, falling back to mock data", err.message);
      }
    }

    // Mock data fallback
    const basePrice = MOCK_STOCKS[upperSymbol]?.price || 100;
    const chartData = Array.from({ length: days }, (_, i) => {
      const date = new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000);
      const volatility = period === "1D" ? 0.02 : period === "1W" ? 0.05 : 0.1;
      const price = basePrice + (Math.random() - 0.5) * basePrice * volatility;
      return {
        date: date.toISOString().split("T")[0],
        price: Number(price.toFixed(2)),
        high: Number((price * (1 + Math.random() * 0.02)).toFixed(2)),
        low: Number((price * (1 - Math.random() * 0.02)).toFixed(2)),
        open: Number((price + (Math.random() - 0.5) * price * 0.01).toFixed(2)),
        volume: Math.floor(Math.random() * 10000000) + 1000000,
      };
    });

    res.json(chartData);
  } catch (err) {
    res.status(500).json({ message: "Error fetching chart data", error: err.message });
  }
};

const getMarketIndices = async (req, res) => {
  try {
    const indices = [
      { symbol: "^GSPC", name: "S&P 500", price: 4200 + Math.random() * 200, change: (Math.random() - 0.5) * 2 },
      { symbol: "^IXIC", name: "NASDAQ Composite", price: 13000 + Math.random() * 500, change: (Math.random() - 0.5) * 3 },
      { symbol: "^DJI", name: "Dow Jones Industrial", price: 33000 + Math.random() * 1000, change: (Math.random() - 0.5) * 1.5 },
      { symbol: "^RUT", name: "Russell 2000", price: 2000 + Math.random() * 100, change: (Math.random() - 0.5) * 2.5 },
    ];

    if (USE_STOCK_API) {
      try {
        const indexPromises = indices.map(async (index) => {
          try {
            const quote = await finnhubRequest("/quote", { symbol: index.symbol });
            return {
              ...index,
              price: quote.c || index.price,
              change: quote.dp || index.change,
              changePercent: quote.dp || index.change,
            };
          } catch {
            return index;
          }
        });

        const updatedIndices = await Promise.all(indexPromises);
        return res.json(updatedIndices);
      } catch (err) {
        console.warn("Finnhub indices failed, using mock data", err.message);
      }
    }

    res.json(indices.map(index => ({
      ...index,
      changePercent: index.change,
    })));
  } catch (err) {
    res.status(500).json({ message: "Error fetching market indices", error: err.message });
  }
};

const getSectorPerformance = async (req, res) => {
  try {
    const sectors = [
      { name: "Technology", change: (Math.random() - 0.5) * 4, marketCap: 15000000000000 },
      { name: "Healthcare", change: (Math.random() - 0.5) * 3, marketCap: 8000000000000 },
      { name: "Financial Services", change: (Math.random() - 0.5) * 2.5, marketCap: 6000000000000 },
      { name: "Consumer Cyclical", change: (Math.random() - 0.5) * 3.5, marketCap: 4000000000000 },
      { name: "Communication Services", change: (Math.random() - 0.5) * 2, marketCap: 3500000000000 },
      { name: "Industrials", change: (Math.random() - 0.5) * 2.8, marketCap: 3000000000000 },
      { name: "Consumer Defensive", change: (Math.random() - 0.5) * 1.5, marketCap: 2500000000000 },
      { name: "Energy", change: (Math.random() - 0.5) * 4.5, marketCap: 2000000000000 },
      { name: "Utilities", change: (Math.random() - 0.5) * 1.2, marketCap: 1500000000000 },
      { name: "Real Estate", change: (Math.random() - 0.5) * 2.2, marketCap: 1000000000000 },
      { name: "Materials", change: (Math.random() - 0.5) * 3.2, marketCap: 800000000000 },
    ];

    res.json(sectors.sort((a, b) => Math.abs(b.change) - Math.abs(a.change)));
  } catch (err) {
    res.status(500).json({ message: "Error fetching sector performance", error: err.message });
  }
};

module.exports = { searchStocks, getStockPrice, getAllStocks, getTopMovers, getStockChart, getMarketIndices, getSectorPerformance };
