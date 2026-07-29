import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingState, setLoadingState] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setLoadingState(true);
    const result = await register(name, email, password);
    setLoadingState(false);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center relative py-12">
      {/* Background gradients */}
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
            <UserPlus className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Create Account</h2>
          <p className="text-slate-400 text-sm">Join FareWise and get the smart edge on travel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider ml-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full glass-input pl-11"
              />
            </div>
          </div>

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
            <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                required
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input pl-11"
              />
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loadingState}
            className="w-full glass-btn-primary py-3.5 flex items-center justify-center gap-2 mt-6"
          >
            {loadingState ? (
              <div className="w-5 h-5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-5 h-5 text-navy-950" />
                Sign Up
              </>
            )}
          </button>
        </form>

        <div className="border-t border-white/5 my-6" />

        <p className="text-sm text-slate-400 text-center">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-skyAccent-light hover:text-skyAccent font-semibold transition-colors duration-150"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
