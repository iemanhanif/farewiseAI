import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { motion } from 'framer-motion';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  User, 
  Compass, 
  Heart, 
  Search, 
  History, 
  Sparkles, 
  TrendingDown, 
  Plane, 
  DollarSign, 
  Activity 
} from 'lucide-react';

// Register ChartJS elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Component states
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(null);
  const [monthlyPrices, setMonthlyPrices] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState('Dubai');
  const [priceChartLoading, setPriceChartLoading] = useState(false);

  // Available destinations for line chart price check
  const chartDestinations = ['Dubai', 'London', 'Istanbul', 'Paris', 'Tokyo', 'Bangkok', 'New York', 'Sydney'];

  const fetchDashboardStats = async () => {
    try {
      const { data } = await API.get('/flights/dashboard-stats');
      setStatsData(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchMonthlyPrices = async (dest) => {
    setPriceChartLoading(true);
    try {
      const { data } = await API.get(`/flights/monthly-prices?destination=${dest}`);
      // Sort months sequentially
      const monthOrder = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const sortedPrices = data.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
      setMonthlyPrices(sortedPrices);
    } catch (error) {
      console.error('Error fetching monthly prices:', error);
    } finally {
      setPriceChartLoading(false);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await fetchDashboardStats();
      await fetchMonthlyPrices(selectedDestination);
      setLoading(false);
    };
    loadAll();
  }, []);

  // Update line chart on dropdown change
  const handleDestChange = async (e) => {
    const dest = e.target.value;
    setSelectedDestination(dest);
    await fetchMonthlyPrices(dest);
  };

  if (loading || !statsData) {
    return (
      <div className="space-y-6 py-6 text-left">
        <div className="h-10 w-60 skeleton" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 skeleton" />
          <div className="h-32 skeleton" />
          <div className="h-32 skeleton" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 skeleton" />
          <div className="h-72 skeleton" />
        </div>
      </div>
    );
  }

  const { recentSearches, savedFlights, cheapestDestinationThisMonth, stats } = statsData;

  // Chart Configurations
  // 1. Line Chart: Average Prices By Month for Selected Destination
  const lineChartData = {
    labels: monthlyPrices.map(item => item.month.substring(0, 3)),
    datasets: [
      {
        label: `Avg Fare for ${selectedDestination} ($)`,
        data: monthlyPrices.map(item => item.averagePrice),
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        borderWidth: 3,
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointHoverRadius: 6
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0b132b',
        titleFont: { family: 'Outfit', size: 13 },
        bodyFont: { family: 'Inter', size: 12 },
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
      }
    }
  };

  // 2. Bar Chart: Most Searched Destinations
  const barChartData = {
    labels: stats.popularDestinations.map(item => item.name),
    datasets: [
      {
        data: stats.popularDestinations.map(item => item.count),
        backgroundColor: [
          'rgba(14, 165, 233, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)'
        ],
        borderWidth: 0,
        borderRadius: 8
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0b132b',
        bodyFont: { family: 'Inter', size: 12 }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { precision: 0, color: '#94a3b8', font: { family: 'Inter', size: 11 } }
      }
    }
  };

  // 3. Doughnut Chart: Saved Flights Travel Class Distribution
  const hasSavedFlights = stats.classCounts.Economy > 0 || stats.classCounts.Business > 0 || stats.classCounts.First > 0;
  const doughnutChartData = {
    labels: ['Economy', 'Business', 'First'],
    datasets: [
      {
        data: [stats.classCounts.Economy, stats.classCounts.Business, stats.classCounts.First],
        backgroundColor: [
          'rgba(14, 165, 233, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderColor: '#0b132b',
        borderWidth: 2
      }
    ]
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          font: { family: 'Inter', size: 11 },
          boxWidth: 12
        }
      }
    }
  };

  return (
    <div className="space-y-8 py-6 text-left">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-sans">
            Welcome back, <span className="text-gradient-sky font-extrabold">{user?.name.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Here is a summary of your flight advisor dashboard.</p>
        </div>
        <Link to="/search" className="glass-btn-primary flex items-center gap-2">
          <Search className="w-4 h-4 text-navy-950 font-bold" />
          Plan a New Flight
        </Link>
      </div>

      {/* Grid: 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="glass-panel p-6 border border-white/5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-skyAccent/10 border border-skyAccent/20 flex items-center justify-center">
            <User className="w-7 h-7 text-skyAccent-light" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">User Status</p>
            <p className="text-lg font-bold text-white mt-0.5">Explorer Elite</p>
            <p className="text-xs text-slate-500 mt-0.5">Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})}</p>
          </div>
        </div>

        {/* Cheapest Destination Card */}
        <div className="glass-panel p-6 border border-white/5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-emeraldAccent/10 border border-emeraldAccent/20 flex items-center justify-center">
            <TrendingDown className="w-7 h-7 text-emeraldAccent-light" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Best Deal This Month</p>
            <p className="text-lg font-bold text-white mt-0.5">
              {cheapestDestinationThisMonth.destination}
            </p>
            <p className="text-xs text-emeraldAccent-light font-semibold mt-0.5">
              Avg. fare ${cheapestDestinationThisMonth.averagePrice} ({cheapestDestinationThisMonth.month})
            </p>
          </div>
        </div>

        {/* Saved Flights average Card */}
        <div className="glass-panel p-6 border border-white/5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Heart className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Saved Monitoring</p>
            <p className="text-lg font-bold text-white mt-0.5">{savedFlights.length} Flights Active</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {stats.avgSavedPrice > 0 ? `Avg. budget $${stats.avgSavedPrice}` : 'Track items to monitor prices'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Line Chart: Destination Fares (LHS, spanning 8 columns) */}
        <div className="lg:col-span-8 glass-panel p-6 border border-white/5 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-skyAccent-light" />
                Seasonal Price Trends
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Analyze monthly pricing fluctuations to select the cheapest months.</p>
            </div>
            
            {/* Destination Selection Dropdown */}
            <select
              value={selectedDestination}
              onChange={handleDestChange}
              className="glass-input py-1.5 px-3 text-xs w-full sm:w-auto bg-navy-900 border border-white/10"
            >
              {chartDestinations.map((dest, i) => (
                <option key={i} value={dest}>{dest}</option>
              ))}
            </select>
          </div>
          
          <div className="h-64 relative w-full mt-2">
            {priceChartLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-navy-950/20 backdrop-blur-xs">
                <div className="w-10 h-10 border-4 border-skyAccent/20 border-t-skyAccent rounded-full animate-spin" />
              </div>
            ) : null}
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Doughnut Chart: Class distribution (RHS, spanning 4 columns) */}
        <div className="lg:col-span-4 glass-panel p-6 border border-white/5 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400" />
            Class Distribution
          </h2>
          <p className="text-xs text-slate-400">Class breakdown of your favorite tracked tickets.</p>
          
          <div className="h-56 relative w-full flex items-center justify-center mt-2">
            {hasSavedFlights ? (
              <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
            ) : (
              <div className="text-center p-6 border border-dashed border-white/10 rounded-xl max-w-[200px]">
                <p className="text-xs text-slate-500 leading-relaxed">Save flights during search to see monitoring breakdowns here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Popular searches and history */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most searched destinations (Bar chart) */}
        <div className="glass-panel p-6 border border-white/5 flex flex-col gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-skyAccent-light" />
              Top Queries
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Most popular destinations overall in the platform.</p>
          </div>
          
          <div className="h-56 w-full mt-2">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Saved Flights details */}
        <div className="glass-panel p-6 border border-white/5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400" />
              Saved Flights
            </h2>
            <Link to="/favorites" className="text-xs text-skyAccent-light hover:text-skyAccent font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-3.5 mt-2 flex-grow overflow-y-auto max-h-[224px]">
            {savedFlights.length > 0 ? (
              savedFlights.map((flight, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors duration-150">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-skyAccent/10 text-skyAccent-light">
                      <Plane className="w-4 h-4 transform -rotate-45" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-white">{flight.airline}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{flight.from} → {flight.to} ({flight.class})</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-emeraldAccent-light">${flight.price}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{flight.stops === 0 ? 'Direct' : `${flight.stops} stop`}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-8 text-center">
                <p className="text-xs text-slate-500">No flights saved yet.</p>
                <Link to="/search" className="text-xs text-skyAccent-light hover:underline mt-2">
                  Search & save flights
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Searches */}
        <div className="glass-panel p-6 border border-white/5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-purple-400" />
              Recent Searches
            </h2>
            <Link to="/history" className="text-xs text-skyAccent-light hover:text-skyAccent font-medium">
              View All
            </Link>
          </div>

          <div className="space-y-3 mt-2 flex-grow overflow-y-auto max-h-[224px]">
            {recentSearches.length > 0 ? (
              recentSearches.map((search, idx) => (
                <div 
                  key={idx} 
                  onClick={() => navigate(`/search?from=${search.from}&to=${search.to}&departureDate=${search.departureDate}${search.returnDate ? `&returnDate=${search.returnDate}` : ''}`)}
                  className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:border-skyAccent/30 hover:bg-skyAccent/5 cursor-pointer transition-all duration-200"
                >
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white">{search.from} → {search.to}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{search.departureDate} {search.returnDate ? `| ${search.returnDate}` : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Cheapest</p>
                    <p className="text-xs font-extrabold text-emeraldAccent-light mt-0.5">${search.cheapestPrice || '-'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center py-8 text-center text-slate-500 text-xs">
                No recent searches.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
