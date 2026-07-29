import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingState, setLoadingState] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoadingState(true);
    const result = await login(email, password);
    setLoadingState(false);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center relative py-12">
      {/* Background radial gradients */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-skyAccent/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-emeraldAccent/5 rounded-full blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full glass-panel p-8 border border-white/10 relative z-10"
      >
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-skyAccent/10 border border-skyAccent/20 items-center justify-center text-skyAccent-light mb-2">
            <LogIn className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h2>
          <p className="text-slate-400 text-sm">Sign in to unlock personalized AI flight deals</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input pl-11"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2 text-left">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Forgot password clicked! This feature can be extended here.')}
                className="text-xs text-skyAccent-light hover:text-skyAccent transition-colors duration-150"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input pl-11"
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-xs text-skyAccent-light hover:text-skyAccent transition-colors duration-150"
            >
              Forgot Password?
            </button>
            <button
              type="submit"
              disabled={loadingState}
              className="glass-btn-primary py-3.5 px-6 flex items-center justify-center gap-2"
            >
              {loadingState ? (
                <div className="w-5 h-5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5 text-navy-950" />
                  Sign In
                </>
              )}
            </button>
          </div>
          <button
            type="submit"
            disabled={loadingState}
            className="w-full glass-btn-primary py-3.5 flex items-center justify-center gap-2 mt-6"
          >
            {loadingState ? (
              <div className="w-5 h-5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5 text-navy-950" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="border-t border-white/5 my-6" />

        <p className="text-sm text-slate-400 text-center">
          New to FareWise?{' '}
          <Link
            to="/register"
            className="text-skyAccent-light hover:text-skyAccent font-semibold transition-colors duration-150"
          >
            Create an Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
