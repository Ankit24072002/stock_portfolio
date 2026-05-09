import React, { useState, useEffect } from "react";

const calculateSMA = (prices, period) => {
  const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
  return sum / period;
};

const calculateRSI = (prices, period) => {
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

const calculateEMA = (prices, period) => {
  const multiplier = 2 / (period + 1);
  let ema = prices[0];

  for (let i = 1; i < prices.length; i++) {
    ema = prices[i] * multiplier + ema * (1 - multiplier);
  }

  return ema;
};

const calculateMACD = (prices) => {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  return ema12 - ema26;
};

const TechnicalIndicators = ({ chartData }) => {
  const [indicators, setIndicators] = useState({
    sma20: null,
    sma50: null,
    rsi: null,
    macd: null,
  });

  useEffect(() => {
    if (!chartData || chartData.length < 50) return;

    const prices = chartData.map(d => d.price);

    // Simple Moving Averages
    const sma20 = calculateSMA(prices, 20);
    const sma50 = calculateSMA(prices, 50);

    // RSI (Relative Strength Index)
    const rsi = calculateRSI(prices, 14);

    // MACD (Moving Average Convergence Divergence)
    const macd = calculateMACD(prices);

    setIndicators({
      sma20: sma20.toFixed(2),
      sma50: sma50.toFixed(2),
      rsi: rsi.toFixed(2),
      macd: macd.toFixed(2),
    });
  }, [chartData]);

  const getRSIColor = (rsi) => {
    if (rsi > 70) return "text-red-600"; // Overbought
    if (rsi < 30) return "text-green-600"; // Oversold
    return "text-blue-600"; // Neutral
  };

  const getRSIDescription = (rsi) => {
    if (rsi > 70) return "Overbought";
    if (rsi < 30) return "Oversold";
    return "Neutral";
  };

  if (!indicators.sma20) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Technical indicators require more price data.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Technical Indicators</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">SMA (20)</p>
          <p className="text-lg font-semibold text-slate-900">${indicators.sma20}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">SMA (50)</p>
          <p className="text-lg font-semibold text-slate-900">${indicators.sma50}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">RSI (14)</p>
          <p className={`text-lg font-semibold ${getRSIColor(indicators.rsi)}`}>
            {indicators.rsi}
          </p>
          <p className="text-xs text-slate-500">{getRSIDescription(indicators.rsi)}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">MACD</p>
          <p className={`text-lg font-semibold ${indicators.macd >= 0 ? "text-green-600" : "text-red-600"}`}>
            {indicators.macd >= 0 ? "+" : ""}{indicators.macd}
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Analysis Summary</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• Price vs SMA20: {parseFloat(chartData[chartData.length - 1]?.price) > parseFloat(indicators.sma20) ? "Above" : "Below"} (Bullish when above)</p>
          <p>• RSI Signal: {getRSIDescription(indicators.rsi)} - Consider {indicators.rsi > 70 ? "selling" : indicators.rsi < 30 ? "buying" : "holding"}</p>
          <p>• MACD Trend: {indicators.macd >= 0 ? "Bullish" : "Bearish"} momentum</p>
        </div>
      </div>
    </div>
  );
};

export default TechnicalIndicators;