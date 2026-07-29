import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, DollarSign, Globe, Lock, ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { showToast } = useAuth();
  
  // Mock Settings State
  const [currency, setCurrency] = useState('USD');
  const [prefClass, setPrefClass] = useState('Economy');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [instantAI, setInstantAI] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Settings saved successfully!', 'success');
    }, 8000);
  };

  return (
    <div className="space-y-8 py-6 text-left max-w-2xl mx-auto relative z-10">
      <div>
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors duration-200">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-white mt-1 flex items-center gap-2">
          <SettingsIcon className="w-8 h-8 text-skyAccent-light" /> Settings
        </h1>
        <p className="text-slate-400 text-sm">Configure search parameters and price alert thresholds.</p>
      </div>

      <div className="glass-panel p-6 sm:p-8 border border-white/5">
        <form onSubmit={handleSaveSettings} className="space-y-6">
          
          {/* Preferences Section */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2.5">
              <Globe className="w-4 h-4 text-skyAccent-light" /> General Preferences
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Preferred Currency */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider ml-1">Preferred Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full glass-input py-2.5 px-3 text-xs bg-navy-900 border border-white/10"
                >
                  <option value="USD">USD - United States Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="GBP">GBP - British Pound Sterling (£)</option>
                  <option value="AED">AED - Emirati Dirham (DH)</option>
                  <option value="PKR">PKR - Pakistani Rupee (Rs)</option>
                </select>
              </div>

              {/* Preferred Travel Class */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider ml-1">Default Travel Class</label>
                <select
                  value={prefClass}
                  onChange={(e) => setPrefClass(e.target.value)}
                  className="w-full glass-input py-2.5 px-3 text-xs bg-navy-900 border border-white/10"
                >
                  <option value="Economy">Economy</option>
                  <option value="Business">Business</option>
                  <option value="First">First Class</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Settings Section */}
          <div className="space-y-4 pt-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2.5">
              <Bell className="w-4 h-4 text-emeraldAccent-light" /> Notifications & AI
            </h2>

            <div className="space-y-3.5">
              {/* Toggle 1 */}
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:border-white/10 transition-colors duration-150">
                <div className="text-left space-y-0.5">
                  <p className="text-xs font-semibold text-white">Enable Email Alerts</p>
                  <p className="text-[10px] text-slate-400">Receive price drop notifications for saved flights.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={() => setEmailAlerts(!emailAlerts)}
                  className="w-9 h-5 rounded-full text-skyAccent focus:ring-transparent bg-navy-950/60 border-white/10 cursor-pointer"
                />
              </label>

              {/* Toggle 2 */}
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:border-white/10 transition-colors duration-150">
                <div className="text-left space-y-0.5">
                  <p className="text-xs font-semibold text-white">Instant AI Flight Analysis</p>
                  <p className="text-[10px] text-slate-400">Automatically run Gemini recommendations during search results load.</p>
                </div>
                <input
                  type="checkbox"
                  checked={instantAI}
                  onChange={() => setInstantAI(!instantAI)}
                  className="w-9 h-5 rounded-full text-skyAccent focus:ring-transparent bg-navy-950/60 border-white/10 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              type="submit"
              disabled={saving}
              className="glass-btn-primary py-2.5 px-6 flex items-center justify-center gap-2 text-sm"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 text-navy-950 font-bold" />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
