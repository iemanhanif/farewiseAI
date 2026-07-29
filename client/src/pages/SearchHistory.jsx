import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, Calendar, Search, ArrowLeft, RefreshCw, XOctagon } from 'lucide-react';

const SearchHistory = () => {
  const navigate = useNavigate();
  const { showToast } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const { data } = await API.get('/history');
      setHistory(data);
    } catch (error) {
      console.error('Error fetching search history:', error);
      showToast('Could not load search history.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDeleteItem = async (id, e) => {
    e.stopPropagation(); // Avoid triggering card click (which re-runs search)
    try {
      await API.delete(`/history/${id}`);
      setHistory(history.filter(item => item._id !== id));
      showToast('Search log removed.', 'success');
    } catch (error) {
      showToast('Failed to delete search log.', 'error');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear your entire search history?')) return;
    try {
      await API.delete('/history');
      setHistory([]);
      showToast('Search history cleared.', 'success');
    } catch (error) {
      showToast('Failed to clear search history.', 'error');
    }
  };

  const handleReRunSearch = (item) => {
    let url = `/search?from=${encodeURIComponent(item.from)}&to=${encodeURIComponent(item.to)}&departureDate=${item.departureDate}`;
    if (item.returnDate) {
      url += `&returnDate=${item.returnDate}`;
    }
    navigate(url);
  };

  return (
    <div className="space-y-8 py-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1.5">
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors duration-200">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2 mt-1">
            <History className="w-8 h-8 text-purple-400" /> Search History
          </h1>
          <p className="text-slate-400 text-sm">Review, re-run, or delete your previous flight search requests.</p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-sm transition-all duration-300 active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            Clear All Logs
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-20 skeleton" />
          <div className="h-20 skeleton" />
          <div className="h-20 skeleton" />
        </div>
      ) : history.length === 0 ? (
        <div className="glass-panel p-12 border border-white/5 text-center max-w-lg mx-auto space-y-6">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-purple-400">
            <History className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">No Search Logs</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Your search history is empty. Searches conducted while signed in are saved here for quick price comparisons.
          </p>
          <Link to="/search" className="glass-btn-primary inline-flex items-center gap-2">
            <Search className="w-4 h-4 text-navy-950 font-bold" />
            Start Searching Flights
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {history.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                onClick={() => handleReRunSearch(item)}
                className="glass-panel p-4 border border-white/5 hover:border-skyAccent/30 hover:bg-skyAccent/5 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden group"
              >
                {/* Visual hover indicator */}
                <div className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-skyAccent transition-colors duration-200" />

                <div className="flex flex-wrap items-center gap-6">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <History className="w-5 h-5" />
                  </div>
                  
                  {/* Route details */}
                  <div className="text-left">
                    <p className="text-sm font-bold text-white tracking-wide">
                      {item.from} → {item.to}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
                      <Calendar className="w-3 h-3 text-skyAccent-light" />
                      Depart: {item.departureDate}
                      {item.returnDate && ` | Return: ${item.returnDate}`}
                    </p>
                  </div>
                </div>

                {/* Right actions/stats */}
                <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-6 sm:pl-0 pl-16">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Cheapest Fare</p>
                    <p className="text-base font-extrabold text-emeraldAccent-light mt-0.5">
                      {item.cheapestPrice ? `$${item.cheapestPrice}` : 'N/A'}
                    </p>
                    <p className="text-[9px] text-slate-500 mt-0.5">Checked on {new Date(item.searchDate).toLocaleDateString()}</p>
                  </div>

                  <div className="flex gap-2">
                    {/* Re-run button icon */}
                    <span className="p-2.5 rounded-xl border border-white/5 bg-white/5 text-slate-400 group-hover:text-skyAccent-light group-hover:border-skyAccent/20 group-hover:bg-skyAccent/10 flex items-center justify-center transition-colors duration-200">
                      <RefreshCw className="w-4 h-4" />
                    </span>
                    {/* Delete button */}
                    <button
                      onClick={(e) => handleDeleteItem(item._id, e)}
                      className="p-2.5 rounded-xl border border-red-500/10 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 flex items-center justify-center transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default SearchHistory;
