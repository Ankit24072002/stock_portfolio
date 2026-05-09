import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            📈 Stock Portfolio
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-200 transition">
              Dashboard
            </Link>
            <Link to="/search" className="hover:text-blue-200 transition">
              Search Stocks
            </Link>
            <Link to="/compare" className="hover:text-blue-200 transition">
              Compare Stocks
            </Link>
            <Link to="/portfolio" className="hover:text-blue-200 transition">
              Portfolio
            </Link>
            <Link to="/watchlist" className="hover:text-blue-200 transition">
              Watchlist
            </Link>

            <div className="flex items-center space-x-4">
              <span className="text-sm">Welcome, {user?.name}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
