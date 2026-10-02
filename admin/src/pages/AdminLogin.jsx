import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import SEO from '../components/SEO';

const AdminLogin = () => {
  const { login } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('admin@tejmakeup.com');
  const [password, setPassword] = useState('adminpassword123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email.trim(), password.trim());
      navigate(from, { replace: true });
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password. Default is: admin@tejmakeup.com / adminpassword123');
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        setError('Cannot reach backend server. Please verify that the API server is running on port 5000.');
      } else if (err.response?.status === 405 || err.response?.status === 404) {
        setError(`Backend API endpoint not reachable (${err.response.status}). If deployed, set VITE_API_URL to your backend URL.`);
      } else {
        setError(err.response?.data?.message || 'Failed to sign in. Please verify your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Admin Sign In" />
      <div className="min-h-screen bg-sand-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-sand-300 p-8 sm:p-12 shadow-xl space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-ultra text-champagne-600 font-semibold block">
              Atelier Management
            </span>
            <h1 className="font-serif text-3xl font-light text-noir">
              CMS Administration
            </h1>
            <p className="text-xs text-sand-600 font-light">
              Sign in to manage portfolio looks, client bookings, and services.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-2">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tejmakeup.com"
                  className="w-full pl-10 pr-4 py-3 bg-sand-50/50 border border-sand-300 text-xs focus:outline-none focus:border-champagne-500"
                />
                <Mail className="w-4 h-4 text-sand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-sand-500 hover:text-champagne-600 flex items-center gap-1 focus:outline-none"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-sand-50/50 border border-sand-300 text-xs focus:outline-none focus:border-champagne-500 font-mono"
                />
                <Lock className="w-4 h-4 text-sand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="p-3 bg-champagne-50/80 border border-champagne-200 text-sand-700 text-[11px] space-y-1">
              <span className="font-semibold text-champagne-800 uppercase tracking-widest text-[9px] block">
                Atelier Access Credentials
              </span>
              <div className="flex justify-between font-mono text-[10px] text-sand-800">
                <span>Email: <strong className="text-noir">admin@tejmakeup.com</strong></span>
                <span>Pass: <strong className="text-noir">adminpassword123</strong></span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-noir text-ivory text-xs uppercase tracking-ultra font-medium hover:bg-champagne-600 transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-4 border-t border-sand-200 text-center">
            <a
              href={import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173'}
              className="text-xs text-sand-600 hover:text-noir uppercase tracking-wider transition-colors"
            >
              ← Return to Public Portfolio
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
