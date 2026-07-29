import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../services/api';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailQuery = query.get('email');
    const tokenQuery = query.get('token');
    if (emailQuery) setEmail(decodeURIComponent(emailQuery));
    if (tokenQuery) setToken(tokenQuery);
  }, [query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !token || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      setStatusMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post('/auth/reset-password', { email, token, password });
      setStatusMessage(data.message || 'Password has been reset successfully.');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (error) {
      setStatusMessage(error.response?.data?.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center relative py-12">
      <div className="absolute top-10 left-10 w-64 h-64 bg-skyAccent/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-emeraldAccent/5 rounded-full blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full glass-panel p-8 border border-white/10 relative z-10"
      >
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-emeraldAccent/10 border border-emeraldAccent/20 items-center justify-center text-emeraldAccent-light mb-2">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Reset Password</h2>
          <p className="text-slate-400 text-sm">Enter your new password to restore account access.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2 text-left">
            <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full glass-input py-3 px-4 text-sm bg-navy-950/50"
            />
          </div>

          <div className="space-y-2 text-left">
            <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider ml-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                required
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input pl-11"
              />
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider ml-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                required
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full glass-input pl-11"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full glass-btn-primary py-3.5 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        {statusMessage && (
          <div className="mt-6 p-4 rounded-2xl border border-white/10 bg-white/5 text-slate-200 text-sm">
            {statusMessage}
          </div>
        )}

        <div className="border-t border-white/5 my-6" />

        <div className="flex justify-between text-xs text-slate-400">
          <Link to="/login" className="hover:text-white transition-colors duration-150">Back to sign in</Link>
          <Link to="/" className="hover:text-white transition-colors duration-150">Home</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
