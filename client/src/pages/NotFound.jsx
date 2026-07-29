import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 relative">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-skyAccent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emeraldAccent/10 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full glass-panel border border-white/10 p-8 text-center relative z-10"
      >
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-skyAccent/10 to-skyAccent/20 flex items-center justify-center mb-6 border border-skyAccent/20">
          <Plane className="w-10 h-10 text-skyAccent-light transform -rotate-45" />
        </div>

        <h1 className="text-7xl font-extrabold tracking-tight text-white mb-2 font-sans bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Flight Diverted!</h2>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          The page you are looking for has been moved, renamed, or perhaps is off the radar. Let's get you back on track.
        </p>

        <Link
          to="/"
          className="glass-btn-primary w-full flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          Back to Safe Haven
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
