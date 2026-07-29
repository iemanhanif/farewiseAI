import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Plane, 
  LayoutDashboard, 
  Search, 
  Heart, 
  History, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setIsDropdownOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) => 
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
      isActive 
        ? 'bg-skyAccent/10 text-skyAccent-light border border-skyAccent/20' 
        : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
    }`;

  const mobileNavLinkClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
      isActive 
        ? 'bg-skyAccent/10 text-skyAccent-light border border-skyAccent/20' 
        : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
    }`;

  return (
    <nav className="sticky top-0 z-[100] w-full bg-navy-950/60 backdrop-blur-md border-b border-white/5 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-skyAccent to-emeraldAccent flex items-center justify-center shadow-lg shadow-skyAccent/25 group-hover:scale-105 transition-transform duration-300">
              <Plane className="w-5 h-5 text-navy-950 transform -rotate-45" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-skyAccent-light transition-colors duration-300">
              FareWise<span className="text-skyAccent">.AI</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/search" className={navLinkClass}>
              <Search className="w-4 h-4" />
              Search Flights
            </NavLink>
            
            {user && (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </NavLink>
                <NavLink to="/favorites" className={navLinkClass}>
                  <Heart className="w-4 h-4" />
                  Saved
                </NavLink>
                <NavLink to="/history" className={navLinkClass}>
                  <History className="w-4 h-4" />
                  History
                </NavLink>
                <NavLink to="/chat" className={navLinkClass}>
                  <MessageSquare className="w-4 h-4" />
                  AI Assistant
                </NavLink>
              </>
            )}
          </div>

          {/* User Section (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none group p-1 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-300"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-xl object-cover border border-white/10 group-hover:border-skyAccent/40 transition-colors duration-300"
                  />
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white max-w-[120px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 z-50 glass-panel-light p-2 shadow-2xl animate-fade-in border border-white/10">
                      <div className="px-4 py-3 border-b border-white/5 mb-2">
                        <p className="text-sm font-medium text-white max-w-[180px] truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                      </div>
                      
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-skyAccent/10 hover:text-skyAccent-light transition-all duration-150"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-skyAccent/10 hover:text-skyAccent-light transition-all duration-150"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      
                      <div className="border-t border-white/5 my-1.5" />
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white text-sm font-medium px-4 py-2 transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-skyAccent hover:bg-skyAccent-dark text-navy-950 text-sm font-semibold px-4.5 py-2 rounded-xl transition-all duration-300 shadow-md shadow-skyAccent/15 hover:shadow-skyAccent/25 hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none transition-all duration-200"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 mx-4 glass-panel border border-white/10 p-3 animate-slide-down">
          <div className="space-y-1.5">
            <NavLink
              to="/search"
              onClick={() => setIsOpen(false)}
              className={mobileNavLinkClass}
            >
              <Search className="w-5 h-5" />
              Search Flights
            </NavLink>
            
            {user ? (
              <>
                <NavLink
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={mobileNavLinkClass}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </NavLink>
                <NavLink
                  to="/favorites"
                  onClick={() => setIsOpen(false)}
                  className={mobileNavLinkClass}
                >
                  <Heart className="w-5 h-5" />
                  Saved Flights
                </NavLink>
                <NavLink
                  to="/history"
                  onClick={() => setIsOpen(false)}
                  className={mobileNavLinkClass}
                >
                  <History className="w-5 h-5" />
                  Search History
                </NavLink>
                <NavLink
                  to="/chat"
                  onClick={() => setIsOpen(false)}
                  className={mobileNavLinkClass}
                >
                  <MessageSquare className="w-5 h-5" />
                  AI Travel Assistant
                </NavLink>
                
                <div className="border-t border-white/5 my-2.5" />
                
                <NavLink
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className={mobileNavLinkClass}
                >
                  <User className="w-5 h-5" />
                  My Profile
                </NavLink>
                <NavLink
                  to="/settings"
                  onClick={() => setIsOpen(false)}
                  className={mobileNavLinkClass}
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </NavLink>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-3 border-t border-white/5">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-slate-300 hover:text-white font-medium py-2.5 rounded-xl hover:bg-white/5 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center bg-skyAccent hover:bg-skyAccent-dark text-navy-950 font-semibold py-2.5 rounded-xl shadow-lg transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
