import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../services/api';
import { Mail, ArrowLeft, ShieldCheck } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const { data } = await API.post('/auth/forgot-password', { email: email.trim() });
      setStatusMessage(data.message || 'If the email exists, password reset instructions have been sent.');
      setResetLink(data.resetLink || '');
    } catch (error) {
      setStatusMessage(error.response?.data?.message || 'Unable to process your request right now.');
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
          <div className="inline-flex w-12 h-12 rounded-xl bg-skyAccent/10 border border-skyAccent/20 items-center justify-center text-skyAccent-light mb-2">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Forgot Password</h2>
          <p className="text-slate-400 text-sm">Enter your email to generate a secure reset link.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2 text-left">
            <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider ml-1">Email Address</label>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full glass-btn-primary py-3.5 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {statusMessage && (
          <div className="mt-6 p-4 rounded-2xl border border-white/10 bg-white/5 text-slate-200 text-sm">
            <p>{statusMessage}</p>
            {resetLink && (
              <p className="mt-3 text-xs text-skyAccent-light break-all">
                Reset Link: <a href={resetLink} className="underline">Open reset page</a>
              </p>
            )}
          </div>
        )}

        <div className="border-t border-white/5 my-6" />

        <p className="text-sm text-slate-400 text-center">
          Remembered your password?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-skyAccent-light hover:text-skyAccent font-semibold transition-colors duration-150"
          >
            Sign In
          </button>
        </p>

        <div className="mt-4 text-center text-xs text-slate-500">
          <Link to="/" className="hover:text-white transition-colors duration-150">Back to home</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
