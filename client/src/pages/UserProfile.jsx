import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Calendar, History, Heart, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const { user, updateProfile, showToast } = useAuth();
  
  // Profile stats state
  const [profileStats, setProfileStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form inputs state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchProfileDetails = async () => {
    try {
      const { data } = await API.get('/auth/profile');
      setProfileStats(data);
      setName(data.name);
      setEmail(data.email);
    } catch (error) {
      console.error('Error fetching profile:', error);
      showToast('Could not load profile statistics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileDetails();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (password && password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    setUpdating(true);
    const updateData = { name, email };
    if (password) {
      updateData.password = password;
    }

    const result = await updateProfile(updateData);
    setUpdating(false);

    if (result.success) {
      setPassword('');
      setConfirmPassword('');
      // Reload stats to fetch updated name/email
      fetchProfileDetails();
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 py-6 text-left max-w-2xl mx-auto">
        <div className="h-6 w-32 skeleton" />
        <div className="h-48 skeleton" />
        <div className="h-72 skeleton" />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 text-left max-w-2xl mx-auto relative z-10">
      <div>
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors duration-200">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-white mt-1">User Profile</h1>
        <p className="text-slate-400 text-sm">Manage your profile details and monitor flight advisor telemetry.</p>
      </div>

      {/* Grid: Profile Telemetry Panel */}
      <div className="glass-panel p-6 border border-white/5 bg-gradient-to-tr from-navy-900/40 via-navy-900/30 to-skyAccent/5 flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar */}
        <img
          src={profileStats?.avatar}
          alt={profileStats?.name}
          className="w-20 h-20 rounded-2xl border border-white/10 object-cover bg-navy-950"
        />

        {/* User stats */}
        <div className="flex-grow text-center sm:text-left space-y-1">
          <h2 className="text-xl font-bold text-white tracking-wide">{profileStats?.name}</h2>
          <p className="text-sm text-slate-400">{profileStats?.email}</p>
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 text-xs text-slate-500 pt-2 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-skyAccent-light" />
              Member since {new Date(profileStats?.createdAt).toLocaleDateString(undefined, {month: 'long', year: 'numeric'})}
            </span>
          </div>
        </div>

        {/* Stats breakdown */}
        <div className="flex gap-4 sm:border-l sm:border-white/5 sm:pl-6 w-full sm:w-auto justify-center sm:justify-start">
          <div className="text-center px-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-1.5 border border-purple-500/20">
              <History className="w-5 h-5" />
            </div>
            <p className="text-lg font-black text-white">{profileStats?.stats?.totalSearches}</p>
            <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mt-0.5">Searches</p>
          </div>
          <div className="text-center px-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-1.5 border border-red-500/20">
              <Heart className="w-5 h-5" />
            </div>
            <p className="text-lg font-black text-white">{profileStats?.stats?.savedFlightsCount}</p>
            <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mt-0.5">Saved</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="glass-panel p-6 sm:p-8 border border-white/5">
        <h2 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-3">Update Details</h2>
        
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider ml-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input pl-10 text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input pl-10 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            {/* Password */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider ml-1">
                New Password (Optional)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input pl-10 text-sm"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider ml-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="Retype password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full glass-input pl-10 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              type="submit"
              disabled={updating}
              className="glass-btn-primary py-2.5 px-6 flex items-center justify-center gap-2 text-sm"
            >
              {updating ? (
                <div className="w-5 h-5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 text-navy-950 font-bold" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
