import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Heart, Clock, ArrowLeft, Search, LogOut } from 'lucide-react';

const FavoriteFlights = () => {
  const navigate = useNavigate();
  const { showToast } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      const { data } = await API.get('/favorites');
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      showToast('Could not load favorites.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleUnsave = async (flightId) => {
    try {
      await API.delete(`/favorites/${flightId}`);
      setFavorites(favorites.filter(item => item.flightId._id !== flightId));
      showToast('Flight removed from saved list.', 'success');
    } catch (error) {
      showToast('Failed to remove flight.', 'error');
    }
  };

  return (
    <div className="space-y-8 py-6 text-left">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors duration-200">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2 mt-1">
            <Heart className="w-8 h-8 text-red-500 fill-current" /> Saved Flights
          </h1>
          <p className="text-slate-400 text-sm">Monitor fares and schedules for your tracked routes.</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-24 skeleton" />
          <div className="h-24 skeleton" />
          <div className="h-24 skeleton" />
        </div>
      ) : favorites.length === 0 ? (
        <div className="glass-panel p-12 border border-white/5 text-center max-w-lg mx-auto space-y-6">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-red-400">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">No Saved Flights</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            You haven't favorited any flights yet. Search for flights and click the heart icon to save and monitor fares here.
          </p>
          <Link to="/search" className="glass-btn-primary inline-flex items-center gap-2">
            <Search className="w-4 h-4 text-navy-950 font-bold" />
            Search Flights Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {favorites.map((item) => {
              const flight = item.flightId;
              if (!flight) return null; // safety check
              
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="glass-panel p-5 border border-white/5 relative text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-white/10"
                >
                  {/* Flight Info */}
                  <div className="flex-grow flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                        <Plane className="w-5 h-5 transform -rotate-45" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{flight.airline}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] font-semibold">{flight.class}</span>
                          <span className="ml-2 text-[10px] text-slate-500">Tracked since {new Date(item.savedAt).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-left">
                        <p className="text-sm font-semibold text-slate-200">{flight.from}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Departure</p>
                      </div>

                      <div className="flex flex-col items-center min-w-[80px]">
                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-skyAccent-light" />
                          {flight.duration}
                        </span>
                        <div className="relative w-full h-0.5 bg-white/10 my-2">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-navy-950 border border-white/20">
                            <div className="w-1 h-1 rounded-full bg-skyAccent" />
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                        </span>
                      </div>

                      <div className="text-left">
                        <p className="text-sm font-semibold text-slate-200">{flight.to}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Arrival</p>
                      </div>
                    </div>

                    <div className="flex items-center sm:items-end justify-between sm:justify-start sm:flex-col w-full sm:w-auto gap-4">
                      <div className="text-left sm:text-right">
                        <p className="text-2xl font-black text-emeraldAccent-light">${flight.price}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Price details</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUnsave(flight._id)}
                          className="p-2.5 rounded-xl border bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all duration-300 flex items-center justify-center"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                        <button 
                          onClick={() => alert(`Redirecting to book flight for $${flight.price}...`)}
                          className="bg-white/5 border border-white/10 hover:bg-skyAccent hover:text-navy-950 text-slate-300 font-semibold px-4.5 py-2 rounded-xl text-xs transition-all duration-300"
                        >
                          Book Fare
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default FavoriteFlights;
