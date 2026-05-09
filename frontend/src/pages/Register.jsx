import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
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
    try {
      const response = await api.post("/auth/register", formData);
      login(response.data.user, response.data.token, true);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-8">
      <div className="grid w-full max-w-6xl gap-8 overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        <div className="relative bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-700 p-10 sm:p-14">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.35),_transparent_25%)]" />
          <div className="absolute left-10 top-10 h-28 w-28 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Launch your portfolio.</h1>
            <p className="text-slate-100 mb-8 leading-7">
              Create your account and start tracking stocks, building watchlists, and managing trades with confidence.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                <span className="rounded-2xl bg-white/20 px-3 py-2 text-sm font-semibold">Fast</span>
                <p className="text-sm text-slate-100">Onboard quickly with easy signup and secure login.</p>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                <span className="rounded-2xl bg-white/20 px-3 py-2 text-sm font-semibold">Smart</span>
                <p className="text-sm text-slate-100">Track holdings, transactions, and profits instantly.</p>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                <span className="rounded-2xl bg-white/20 px-3 py-2 text-sm font-semibold">Secure</span>
                <p className="text-sm text-slate-100">Built with JWT authentication and modern API design.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-slate-950 p-10 sm:p-14">
          <div className="w-full max-w-md text-white">
            <div className="mb-6">
              <span className="inline-flex rounded-full bg-blue-500/20 px-3 py-1 text-sm font-semibold text-blue-100">
                Start Trading
              </span>
              <h2 className="mt-6 text-3xl font-bold tracking-tight">Create your account</h2>
              <p className="mt-3 text-sm text-slate-400">
                Join now to begin managing a virtual stock portfolio with powerful tools.
              </p>
            </div>

            {error && <div className="rounded-2xl bg-red-100 px-4 py-3 text-sm font-medium text-red-700 mb-5">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="text-sm text-slate-300">Full Name</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
                  required
                />
              </label>
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
                <span className="text-sm text-slate-300">Phone (optional)</span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-3xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:from-cyan-300 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Registering..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-white hover:text-cyan-200">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
