import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PortfolioProvider } from "./context/PortfolioContext";
import { StockProvider } from "./context/StockContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SearchStock from "./pages/SearchStock";
import Portfolio from "./pages/Portfolio";
import Watchlist from "./pages/Watchlist";
import StockDetails from "./pages/StockDetails";
import StockComparison from "./pages/StockComparison";

const ProtectedRoute = ({ element }) => {
  const { token, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return token ? element : <Navigate to="/login" />;
};

function AppRoutes() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/" /> : <Register />} />
      <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/search" element={<ProtectedRoute element={<SearchStock />} />} />
      <Route path="/portfolio" element={<ProtectedRoute element={<Portfolio />} />} />
      <Route path="/watchlist" element={<ProtectedRoute element={<Watchlist />} />} />
      <Route path="/stock/:symbol" element={<ProtectedRoute element={<StockDetails />} />} />
      <Route path="/compare" element={<ProtectedRoute element={<StockComparison />} />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <StockProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </StockProvider>
      </PortfolioProvider>
    </AuthProvider>
  );
}

export default App; 