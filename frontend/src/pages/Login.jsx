import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
        rememberMe,
      });

      login(response.data.user, response.data.token, rememberMe);
      navigate("/");
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      const serverError = err.response?.data?.error;
      setError(serverError ? `${serverMessage}: ${serverError}` : serverMessage || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-8">
      <div className="grid w-full max-w-6xl gap-8 overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        <div className="relative bg-gradient-to-br from-blue-700 via-sky-600 to-cyan-500 p-10 sm:p-14">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.5),_transparent_30%)]" />
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Invest smarter.</h1>
            <p className="text-slate-100 mb-8 leading-7">
              Manage your virtual stock portfolio with a professional dashboard, watchlists and secure authentication.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                <span className="rounded-2xl bg-white/20 px-3 py-2 text-sm font-semibold">01</span>
                <p className="text-sm text-slate-100">Track your holdings and profit/loss instantly.</p>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                <span className="rounded-2xl bg-white/20 px-3 py-2 text-sm font-semibold">02</span>
                <p className="text-sm text-slate-100">Buy, sell and monitor market movements with ease.</p>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                <span className="rounded-2xl bg-white/20 px-3 py-2 text-sm font-semibold">03</span>
                <p className="text-sm text-slate-100">Secure login powered by JWT and modern backend APIs.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-slate-950 p-10 sm:p-14">
          <div className="w-full max-w-md text-white">
            <div className="mb-6">
              <span className="inline-flex rounded-full bg-blue-500/20 px-3 py-1 text-sm font-semibold text-blue-100">
                Welcome Back
              </span>
              <h2 className="mt-6 text-3xl font-bold tracking-tight">Login to your account</h2>
              <p className="mt-3 text-sm text-slate-400">
                Secure login with email and password.
              </p>
            </div>

            {error && <div className="rounded-2xl bg-red-100 px-4 py-3 text-sm font-medium text-red-700 mb-5">{error}</div>}
            {message && <div className="rounded-2xl bg-cyan-100 px-4 py-3 text-sm font-medium text-cyan-900 mb-5">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="text-sm text-slate-300">Email</span>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-300">Password</span>
                <input
                  type="password"
                  name="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
                  required
                />
              </label>
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-400"
                  />
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-3 text-base font-semibold text-slate-950 transition hover:from-blue-400 hover:to-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              New here?{' '}
              <Link to="/register" className="font-semibold text-white hover:text-cyan-200">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
