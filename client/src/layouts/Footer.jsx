import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Globe, Link2, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-navy-950/90 border-t border-white/5 pt-16 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Tagline */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-skyAccent to-emeraldAccent flex items-center justify-center shadow-lg shadow-skyAccent/20">
                <Plane className="w-5 h-5 text-navy-950 transform -rotate-45" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                FareWise<span className="text-skyAccent">.AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering smart travelers with AI-driven pricing analytics, predictive advisories, and tailored flight recommendations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search" className="text-slate-400 hover:text-skyAccent-light text-sm transition-colors duration-200">
                  Flight Search
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-slate-400 hover:text-skyAccent-light text-sm transition-colors duration-200">
                  AI Travel Assistant
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-skyAccent-light text-sm transition-colors duration-200">
                  Price Trends
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-400 text-sm hover:text-white cursor-pointer transition-colors duration-200">Our Story</span>
              </li>
              <li>
                <span className="text-slate-400 text-sm hover:text-white cursor-pointer transition-colors duration-200">Contact Us</span>
              </li>
              <li>
                <span className="text-slate-400 text-sm hover:text-white cursor-pointer transition-colors duration-200">Careers</span>
              </li>
            </ul>
          </div>

          {/* Legal and Social Links */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Connect</h3>
            <div className="flex gap-4 mb-4">
              <span className="w-10 h-10 rounded-xl bg-white/5 hover:bg-skyAccent/10 border border-white/10 hover:border-skyAccent/20 flex items-center justify-center text-slate-400 hover:text-skyAccent-light cursor-pointer transition-all duration-300">
                <Globe className="w-4 h-4" />
              </span>
              <span className="w-10 h-10 rounded-xl bg-white/5 hover:bg-skyAccent/10 border border-white/10 hover:border-skyAccent/20 flex items-center justify-center text-slate-400 hover:text-skyAccent-light cursor-pointer transition-all duration-300">
                <Link2 className="w-4 h-4" />
              </span>
              <span className="w-10 h-10 rounded-xl bg-white/5 hover:bg-skyAccent/10 border border-white/10 hover:border-skyAccent/20 flex items-center justify-center text-slate-400 hover:text-skyAccent-light cursor-pointer transition-all duration-300">
                <Mail className="w-4 h-4" />
              </span>
            </div>
            <p className="text-slate-400 text-sm flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              support@farewise.ai
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} FareWise AI. All rights reserved. MVP Demo.
          </p>
          <div className="flex gap-6">
            <span className="text-slate-500 hover:text-slate-300 text-xs cursor-pointer transition-colors duration-200">
              Privacy Policy
            </span>
            <span className="text-slate-500 hover:text-slate-300 text-xs cursor-pointer transition-colors duration-200">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
