import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import SEO from '../../components/SEO';

const AdminLogin = () => {
  const { login } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('admin@tejmakeup.com');
  const [password, setPassword] = useState('adminpassword123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to sign in. Please verify your email and password.'
      );
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
              <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-sand-50/50 border border-sand-300 text-xs focus:outline-none focus:border-champagne-500"
                />
                <Lock className="w-4 h-4 text-sand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
            <Link to="/" className="text-xs text-sand-600 hover:text-noir uppercase tracking-wider">
              ← Return to Public Portfolio
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
