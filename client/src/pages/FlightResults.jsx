import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { motion } from 'framer-motion';
import { 
  Plane, 
  Search, 
  Sparkles, 
  TrendingDown, 
  AlertCircle, 
  Heart, 
  Share2, 
  ArrowLeft, 
  Filter, 
  CheckCircle,
  Clock,
  MapPin,
  Calendar
} from 'lucide-react';

const FlightResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, showToast } = useAuth();

  // Search parameters parsing
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      from: params.get('from') || '',
      to: params.get('to') || '',
      departureDate: params.get('departureDate') || '',
      returnDate: params.get('returnDate') || '',
      passengers: params.get('passengers') || '1'
    };
  };

  const queryParams = getQueryParams();

  // Form states for top search header
  const [from, setFrom] = useState(queryParams.from);
  const [to, setTo] = useState(queryParams.to);
  const [departureDate, setDepartureDate] = useState(queryParams.departureDate);
  const [returnDate, setReturnDate] = useState(queryParams.returnDate);

  // Data states
  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState({ outbound: [], inbound: [] });
  const [aiRec, setAiRec] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [favIds, setFavIds] = useState(new Set());
  
  // Filter states
  const [stopsFilter, setStopsFilter] = useState('all'); // 'all', '0', '1+'
  const [classFilter, setClassFilter] = useState('all'); // 'all', 'Economy', 'Business', 'First'
  const [sortBy, setSortBy] = useState('price'); // 'price', 'duration'

  // Fetch search results
  const fetchResults = async () => {
    if (!queryParams.from || !queryParams.to || !queryParams.departureDate) return;
    
    setLoading(true);
    setAiRec('');
    try {
      // Build API query URL
      let url = `/flights/search?from=${encodeURIComponent(queryParams.from)}&to=${encodeURIComponent(queryParams.to)}&departureDate=${queryParams.departureDate}`;
      if (queryParams.returnDate) {
        url += `&returnDate=${queryParams.returnDate}`;
      }
      
      const { data } = await API.get(url);
      setFlights(data);

      // Load user favorites to draw correct stars if logged in
      if (user) {
        const favsRes = await API.get('/favorites');
        const favIdsSet = new Set(favsRes.data.map(item => item.flightId._id));
        setFavIds(favIdsSet);
      }

      // Fetch AI recommendations if we have outbound flights
      if (data.outbound.length > 0) {
        fetchAIRecommendation(data.outbound, queryParams);
      }
    } catch (error) {
      console.error('Error searching flights:', error);
      showToast('Error loading flights. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAIRecommendation = async (outboundFlights, params) => {
    setAiLoading(true);
    try {
      const { data } = await API.post('/ai/recommend', {
        flights: outboundFlights.slice(0, 10), // Send top 10 cheapest flights for efficiency
        searchParams: params
      });
      setAiRec(data.recommendation);
    } catch (error) {
      console.error('Error fetching AI recommendation:', error);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [location.search, user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!from || !to || !departureDate) return;
    let query = `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&departureDate=${departureDate}&passengers=${queryParams.passengers}`;
    if (returnDate) {
      query += `&returnDate=${returnDate}`;
    }
    navigate(`/search${query}`);
  };

  // Toggle favorite
  const handleToggleFavorite = async (flightId) => {
    if (!user) {
      showToast('Please sign in to save flights to favorites.', 'info');
      navigate('/login');
      return;
    }

    const updatedFavs = new Set(favIds);
    if (updatedFavs.has(flightId)) {
      try {
        await API.delete(`/favorites/${flightId}`);
        updatedFavs.delete(flightId);
        setFavIds(updatedFavs);
        showToast('Flight removed from favorites.', 'success');
      } catch (error) {
        showToast('Failed to remove from favorites.', 'error');
      }
    } else {
      try {
        await API.post('/favorites', { flightId });
        updatedFavs.add(flightId);
        setFavIds(updatedFavs);
        showToast('Flight saved to favorites!', 'success');
      } catch (error) {
        showToast('Failed to save to favorites.', 'error');
      }
    }
  };

  // Filter and Sort logic
  const parseDuration = (d) => {
    const hours = d.match(/(\d+)h/);
    const mins = d.match(/(\d+)m/);
    const h = hours ? parseInt(hours[1]) * 60 : 0;
    const m = mins ? parseInt(mins[1]) : 0;
    return h + m;
  };

  const processFlightList = (list) => {
    let result = [...list];
    
    // Apply stops filter
    if (stopsFilter === '0') {
      result = result.filter(f => f.stops === 0);
    } else if (stopsFilter === '1+') {
      result = result.filter(f => f.stops >= 1);
    }

    // Apply class filter
    if (classFilter !== 'all') {
      result = result.filter(f => f.class === classFilter);
    }

    // Apply sort
    if (sortBy === 'price') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'duration') {
      result.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
    }

    return result;
  };

  const processedOutbound = processFlightList(flights.outbound);
  const processedInbound = processFlightList(flights.inbound);

  // Stats for "Cheapest Flight Badge" & "Book Now or Wait"
  // calculated based on processed list
  const cheapestOutbound = processedOutbound.length > 0 ? processedOutbound[0] : null;
  const avgOutboundPrice = processedOutbound.length > 0 
    ? Math.round(processedOutbound.reduce((acc, curr) => acc + curr.price, 0) / processedOutbound.length)
    : 0;

  // "Book Now or Wait" Logic
  let priceInsight = { status: 'stable', badge: 'Monitor Prices', color: 'text-skyAccent-light bg-skyAccent/10 border-skyAccent/20', explanation: '' };
  if (cheapestOutbound && avgOutboundPrice > 0) {
    const ratio = cheapestOutbound.price / avgOutboundPrice;
    if (ratio < 0.82) {
      priceInsight = {
        status: 'buy',
        badge: 'Book Now',
        color: 'text-emeraldAccent-light bg-emeraldAccent/10 border-emeraldAccent/20',
        explanation: `Prices are historically low for this route. The cheapest ticket ($${cheapestOutbound.price}) is about ${Math.round((1 - ratio) * 100)}% lower than average. Lock in this fare now.`
      };
    } else if (ratio > 1.15) {
      priceInsight = {
        status: 'wait',
        badge: 'Wait for Better Prices',
        color: 'text-red-400 bg-red-500/10 border-red-500/20',
        explanation: `Fares are elevated right now. The lowest rate is ${Math.round((ratio - 1) * 100)}% higher than the average. We advise checking prices again in a few days.`
      };
    } else {
      priceInsight = {
        status: 'stable',
        badge: 'Monitor Prices',
        color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
        explanation: 'Prices match standard seasonal averages. If your dates are rigid, book now; otherwise, set a calendar watch.'
      };
    }
  }

  // Calculate Savings for Cheapest badge (cheapest vs second cheapest, or cheapest vs average)
  const savingsAmount = cheapestOutbound && processedOutbound.length > 1
    ? processedOutbound[1].price - cheapestOutbound.price
    : Math.round(avgOutboundPrice * 0.15) || 50;

  return (
    <div className="space-y-8 py-6 text-left">
      {/* Back to Landing Page link */}
      <Link to="/" className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors duration-200">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </Link>

      {/* Top Search Modify Header (rounded glass panel) */}
      <div className="glass-panel p-5 border border-white/5">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-3 space-y-1.5 text-left">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1 ml-1">
              <MapPin className="w-3 h-3 text-skyAccent" /> From
            </label>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full glass-input py-2 px-3 text-sm"
              required
            />
          </div>
          <div className="md:col-span-3 space-y-1.5 text-left">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1 ml-1">
              <MapPin className="w-3 h-3 text-emeraldAccent" /> To
            </label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full glass-input py-2 px-3 text-sm"
              required
            />
          </div>
          <div className="md:col-span-2 space-y-1.5 text-left">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1 ml-1">
              <Calendar className="w-3 h-3 text-skyAccent" /> Depart
            </label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full glass-input py-2 px-3 text-sm"
              required
            />
          </div>
          <div className="md:col-span-2 space-y-1.5 text-left">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1 ml-1">
              <Calendar className="w-3 h-3 text-slate-400" /> Return
            </label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full glass-input py-2 px-3 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full glass-btn-primary py-2 px-4 text-sm flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-navy-950 font-bold" />
              Update
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-44 skeleton" />
            <div className="h-44 skeleton" />
          </div>
          <div className="h-48 skeleton" />
          <div className="space-y-4">
            <div className="h-24 skeleton" />
            <div className="h-24 skeleton" />
            <div className="h-24 skeleton" />
          </div>
        </div>
      ) : flights.outbound.length === 0 ? (
        <div className="glass-panel p-12 border border-white/5 text-center max-w-lg mx-auto space-y-6">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <Plane className="w-8 h-8 transform -rotate-45" />
          </div>
          <h2 className="text-xl font-bold text-white">No Flights Found</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            We couldn't find any flights matching <strong>{queryParams.from}</strong> to <strong>{queryParams.to}</strong> on <strong>{queryParams.departureDate}</strong>.
            Try selecting a date in August or September 2026 (e.g. 2026-08-12) or checking spelling.
          </p>
          <button onClick={() => navigate('/')} className="glass-btn-secondary py-2 px-4 text-sm">
            Modify Search
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* TOP INSIGHTS ROW: Best Price Badge and Book/Wait Advice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cheapest Flight Finder Card */}
            {cheapestOutbound && (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-panel p-5 border border-white/5 bg-gradient-to-tr from-navy-900/40 via-navy-900/30 to-emeraldAccent/5 hover:border-emeraldAccent/20 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emeraldAccent/15 border border-emeraldAccent/30 text-emeraldAccent-light text-xs font-bold uppercase tracking-wider">
                      <TrendingDown className="w-3.5 h-3.5" /> Best Price
                    </span>
                    <h3 className="text-sm font-semibold text-slate-300 mt-2">Lowest Route Fare Available</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-emeraldAccent-light">${cheapestOutbound.price}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{cheapestOutbound.class} Class</p>
                  </div>
                </div>

                <div className="border-t border-white/5 my-4" />

                <div className="flex justify-between items-center text-sm">
                  <div className="text-left">
                    <p className="text-xs text-slate-400">Selected Airline</p>
                    <p className="text-sm font-bold text-white mt-0.5">{cheapestOutbound.airline}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Estimated Savings</p>
                    <p className="text-sm font-bold text-emeraldAccent-light mt-0.5">${savingsAmount} saved</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Book Now or Wait Card */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-panel p-5 border border-white/5 bg-gradient-to-tr from-navy-900/40 via-navy-900/30 to-skyAccent/5 hover:border-skyAccent/20 flex flex-col justify-between"
            >
              <div className="space-y-3 text-left">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${priceInsight.color}`}>
                  <AlertCircle className="w-3.5 h-3.5" /> {priceInsight.badge}
                </span>
                <h3 className="text-sm font-semibold text-slate-300">Smart Price Advisor</h3>
                <p className="text-slate-300 text-xs leading-relaxed">{priceInsight.explanation}</p>
              </div>

              <div className="border-t border-white/5 my-4" />
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                <CheckCircle className="w-3.5 h-3.5 text-skyAccent-light" /> Calculated using real-time flight averages
              </div>
            </motion.div>
          </div>

          {/* MIDDLE ROW: Gemini AI Advisor Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-panel p-6 border border-white/5 relative overflow-hidden bg-gradient-to-br from-navy-900/40 via-navy-900/30 to-skyAccent/5 hover:border-skyAccent/20"
          >
            {/* Sparkle overlay backgrounds */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-skyAccent/10 rounded-full blur-2xl" />

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-skyAccent to-emeraldAccent flex items-center justify-center text-navy-950 flex-shrink-0 shadow-lg shadow-skyAccent/20 animate-pulse">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-2 text-left w-full">
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  FareWise AI Travel Advisor
                </h3>
                
                {aiLoading ? (
                  <div className="space-y-2 py-2">
                    <div className="h-3 w-full skeleton" />
                    <div className="h-3 w-5/6 skeleton" />
                    <div className="h-3 w-4/6 skeleton" />
                  </div>
                ) : (
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {aiRec || "Generating flight insights... analyzing route speeds, stops, layovers and fares."}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* MAIN GRID: Filters (LHS) and Flights list (RHS) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Filters Sidebar (spanning 3 columns) */}
            <div className="lg:col-span-3 space-y-6">
              <div className="glass-panel p-5 border border-white/5 space-y-6 text-left">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                  <Filter className="w-4 h-4 text-skyAccent-light" />
                  Filters & Sorting
                </h3>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Sort Flights</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full glass-input py-2 px-3 text-xs bg-navy-900 border border-white/10"
                  >
                    <option value="price">Price: Low to High</option>
                    <option value="duration">Travel Duration: Shortest</option>
                  </select>
                </div>

                {/* Layover Stops */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Layovers / Stops</label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="stops"
                        checked={stopsFilter === 'all'}
                        onChange={() => setStopsFilter('all')}
                        className="rounded border-white/10 text-skyAccent focus:ring-transparent bg-navy-950"
                      />
                      All Flights
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="stops"
                        checked={stopsFilter === '0'}
                        onChange={() => setStopsFilter('0')}
                        className="rounded border-white/10 text-skyAccent focus:ring-transparent bg-navy-950"
                      />
                      Non-stop (Direct)
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="stops"
                        checked={stopsFilter === '1+'}
                        onChange={() => setStopsFilter('1+')}
                        className="rounded border-white/10 text-skyAccent focus:ring-transparent bg-navy-950"
                      />
                      1 or more Layovers
                    </label>
                  </div>
                </div>

                {/* Travel Class */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Travel Class</label>
                  <div className="flex flex-col gap-2">
                    {['all', 'Economy', 'Business', 'First'].map((cls) => (
                      <label key={cls} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer capitalize">
                        <input
                          type="radio"
                          name="class"
                          checked={classFilter === cls}
                          onChange={() => setClassFilter(cls)}
                          className="rounded border-white/10 text-skyAccent focus:ring-transparent bg-navy-950"
                        />
                        {cls === 'all' ? 'All Classes' : cls}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Flights List (spanning 9 columns) */}
            <div className="lg:col-span-9 space-y-8">
              {/* Outbound Flights Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                  <Plane className="w-5 h-5 text-skyAccent-light transform -rotate-45" />
                  Outbound: {queryParams.from} → {queryParams.to}
                  <span className="text-xs font-normal text-slate-400 ml-1">({processedOutbound.length} options found)</span>
                </h2>

                <div className="space-y-4">
                  {processedOutbound.length > 0 ? (
                    processedOutbound.map((flight) => (
                      <FlightCard
                        key={flight._id}
                        flight={flight}
                        isSaved={favIds.has(flight._id)}
                        onToggleFav={handleToggleFavorite}
                        highlightCheapest={cheapestOutbound && cheapestOutbound._id === flight._id}
                      />
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 py-6 text-center border border-dashed border-white/10 rounded-xl">No outbound flights match the selected filters.</p>
                  )}
                </div>
              </div>

              {/* Inbound Flights Section (only if round trip) */}
              {queryParams.returnDate && (
                <div className="space-y-4 pt-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                    <Plane className="w-5 h-5 text-emeraldAccent-light transform rotate-135" />
                    Return: {queryParams.to} → {queryParams.from}
                    <span className="text-xs font-normal text-slate-400 ml-1">({processedInbound.length} options found)</span>
                  </h2>

                  <div className="space-y-4">
                    {processedInbound.length > 0 ? (
                      processedInbound.map((flight) => (
                        <FlightCard
                          key={flight._id}
                          flight={flight}
                          isSaved={favIds.has(flight._id)}
                          onToggleFav={handleToggleFavorite}
                          highlightCheapest={processedInbound.length > 0 && processedInbound[0]._id === flight._id}
                        />
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 py-6 text-center border border-dashed border-white/10 rounded-xl">No return flights match the selected filters.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-Component: Individual Flight Card
const FlightCard = ({ flight, isSaved, onToggleFav, highlightCheapest }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`glass-panel p-5 border transition-all duration-300 relative text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
        highlightCheapest 
          ? 'border-emeraldAccent/30 shadow-md shadow-emeraldAccent/5' 
          : 'border-white/5 hover:border-white/10'
      }`}
    >
      {/* Cheapest Badge Overlay */}
      {highlightCheapest && (
        <span className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded bg-emeraldAccent text-navy-950 text-[10px] font-black uppercase tracking-wider shadow">
          Cheapest Fare
        </span>
      )}

      {/* Flight Main info */}
      <div className="flex-grow flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
        {/* Left Column: Airline details */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
            <Plane className="w-5 h-5 transform -rotate-45" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{flight.airline}</p>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-slate-400 font-semibold">{flight.class}</span>
            </p>
          </div>
        </div>

        {/* Center Column: Times and layovers */}
        <div className="flex items-center gap-6 text-center sm:text-left">
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-200">{flight.from}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Departure Location</p>
          </div>

          <div className="flex flex-col items-center min-w-[80px]">
            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 text-skyAccent-light" />
              {flight.duration}
            </span>
            {/* Plane track line representation */}
            <div className="relative w-full h-0.5 bg-white/10 my-2">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-navy-950 border border-white/20 flex items-center justify-center">
                <div className={`w-1 h-1 rounded-full ${flight.stops === 0 ? 'bg-skyAccent' : 'bg-yellow-500'}`} />
              </div>
            </div>
            <span className={`text-[10px] font-bold ${flight.stops === 0 ? 'text-skyAccent-light' : 'text-yellow-400'}`}>
              {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
            </span>
          </div>

          <div className="text-left">
            <p className="text-sm font-semibold text-slate-200">{flight.to}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Arrival Location</p>
          </div>
        </div>

        {/* Right Column: Price and booking button */}
        <div className="flex items-center sm:items-end justify-between sm:justify-start sm:flex-col w-full sm:w-auto gap-4">
          <div className="text-left sm:text-right">
            <p className="text-2xl font-black text-emeraldAccent-light">${flight.price}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Total per passenger</p>
          </div>
          
          <div className="flex gap-2">
            {/* Save Button */}
            <button
              onClick={() => onToggleFav(flight._id)}
              className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center ${
                isSaved
                  ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={() => alert(`Directing to Airline provider to book this ${flight.airline} flight for $${flight.price}...`)}
              className="bg-white/5 border border-white/10 hover:bg-skyAccent hover:text-navy-950 text-slate-300 font-semibold px-4.5 py-2 rounded-xl text-xs transition-all duration-300"
            >
              Book Fare
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FlightResults;
