import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success && result.user?.role === 'admin') {
        navigate('/admin');
        return;
      }

      await logout();
      setError('Admin access only. Use an admin account to continue.');
    } catch (err) {
      setError(err?.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('admin123@gmail.com');
    setPassword('admin12345');
    setError('');
  };

  return (
    <div className="min-h-screen bg-back-office-shell px-4 py-6 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md items-center">
        <div className="w-full rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-glow backdrop-blur-xl sm:p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Watch2Day</p>
          <h1 className="text-3xl font-bold leading-tight text-slate-50 sm:text-4xl">Back Office</h1>
          <p className="mt-3 mb-7 text-sm leading-6 text-slate-300">Sign in to manage users, movies, and platform settings.</p>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-200">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@watch2day.com"
                autoComplete="email"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-200">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
              />
            </label>

            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

            <div className="flex items-center justify-between gap-3">
              <button type="button" onClick={fillDemo} className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200">Use demo</button>
              <button type="submit" disabled={isLoading} className="rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70">
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
