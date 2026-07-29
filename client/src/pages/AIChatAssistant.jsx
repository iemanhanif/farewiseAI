import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  ArrowLeft, 
  HelpCircle, 
  MapPin,
  Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AIChatAssistant = () => {
  const { user, showToast } = useAuth();
  
  // Chat state
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello ${user?.name.split(' ')[0] || 'there'}! I am FareWise AI, your digital travel concierge. 

I can help you plan budgets, suggest packing guides, compare airline comfort, advise on entry rules, or tell you the best months to visit any destination.

Where are you thinking of traveling to next?`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  // Chat window auto-scroll ref
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Pre-baked suggestions
  const suggestions = [
    "Is Dubai expensive?",
    "What is the best month to visit Turkey?",
    "Which airline is better?",
    "What should I pack?",
    "Is Japan safe for tourists?"
  ];

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    // Add user message to state
    const userMsg = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    // Filter message logs to send as history (limit to last 10 messages for token control)
    const chatHistory = messages.slice(-10).map(m => ({
      role: m.role,
      text: m.text
    }));

    try {
      const { data } = await API.post('/ai/chat', {
        message: textToSend,
        history: chatHistory
      });

      // Add assistant response to state
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (error) {
      console.error('Error in AI Chat:', error);
      showToast('Assistant is temporarily offline. Please try again.', 'error');
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          text: "I apologize, but I encountered an error communicating with the main server. Let's try that again. In the meantime, you can ask about Dubai, Turkey, or packing checklists!" 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  return (
    <div className="h-[78vh] flex flex-col md:flex-row gap-6 py-4 text-left relative z-10">
      
      {/* LHS Sidebar: Chat details and suggestions (spanning 1/3) */}
      <div className="w-full md:w-80 flex flex-col gap-5 justify-between">
        <div className="space-y-4">
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors duration-200">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-skyAccent-light" /> AI Travel Assistant
            </h1>
            <p className="text-slate-400 text-xs leading-relaxed">
              Ask about destination costs, local laws, packing suggestions, airline comparisons, or ideal seasons.
            </p>
          </div>
        </div>

        {/* Suggestion Chips Panel */}
        <div className="glass-panel p-5 border border-white/5 space-y-4 flex-grow md:flex-grow-0">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2.5">
            <Compass className="w-4 h-4 text-emeraldAccent-light" /> Suggested Queries
          </h3>
          <div className="flex flex-col gap-2">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sug)}
                disabled={loading}
                className="w-full text-left text-xs bg-white/5 hover:bg-skyAccent/10 hover:text-skyAccent-light border border-white/5 hover:border-skyAccent/20 p-3 rounded-xl transition-all duration-300 active:scale-95 leading-relaxed text-slate-300"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RHS: Core Chat window (spanning 2/3) */}
      <div className="flex-grow glass-panel border border-white/5 flex flex-col overflow-hidden h-full">
        {/* Chat header */}
        <div className="px-5 py-4 border-b border-white/5 bg-navy-900/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-skyAccent to-emeraldAccent flex items-center justify-center text-navy-950 font-bold shadow-md shadow-skyAccent/10">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">FareWise Co-Pilot</h3>
            <p className="text-[10px] text-emeraldAccent-light font-semibold uppercase tracking-wider flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emeraldAccent animate-ping" /> Online
            </p>
          </div>
        </div>

        {/* Message Logs */}
        <div className="flex-grow overflow-y-auto px-5 py-6 space-y-5 bg-navy-950/10">
          <AnimatePresence>
            {messages.map((msg, index) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start gap-3 max-w-[85%] ${
                    isAssistant ? 'mr-auto text-left' : 'ml-auto flex-row-reverse text-right'
                  }`}
                >
                  {/* Avatar */}
                  <img
                    src={
                      isAssistant 
                        ? 'https://api.dicebear.com/7.x/bottts/svg?seed=FareWiseAI' 
                        : (user?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=User')
                    }
                    alt={isAssistant ? 'AI' : 'User'}
                    className="w-8 h-8 rounded-lg border border-white/10 flex-shrink-0"
                  />

                  {/* Message Bubble */}
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    isAssistant 
                      ? 'glass-panel-light border-white/5 text-slate-200 shadow-md' 
                      : 'bg-skyAccent text-navy-950 font-medium shadow-md shadow-skyAccent/10'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Typing Indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 mr-auto max-w-[80%]"
            >
              <img
                src="https://api.dicebear.com/7.x/bottts/svg?seed=FareWiseAI"
                alt="AI"
                className="w-8 h-8 rounded-lg border border-white/10"
              />
              <div className="glass-panel-light px-4 py-3 rounded-2xl flex gap-1.5 items-center">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input box form */}
        <div className="p-4 border-t border-white/5 bg-navy-900/20">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask anything (e.g. is Dubai hot in July?)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
              className="flex-grow glass-input py-3 px-4 text-sm"
              required
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="glass-btn-primary py-3 px-5 flex items-center justify-center shadow-lg shadow-skyAccent/20 disabled:opacity-50 disabled:pointer-events-none active:scale-95 transition-all duration-200"
            >
              <Send className="w-4 h-4 text-navy-950 font-bold" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChatAssistant;
