"use client";
import Link from "next/link";
import React, { useState, useEffect } from 'react';

export default function MrInfinityBlog() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState('idle');

  // Inject Custom Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&f[]=author@400,500,600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackStatus('submitted');
    setTimeout(() => {
      setShowFeedback(false);
      setFeedbackStatus('idle');
    }, 2000);
  };

  // The Orbiting Space Logo SVG
  const Logo = () => (
    <svg viewBox="0 0 100 100" className="w-10 h-10 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" className={isDarkMode ? "text-orange-500/80" : "text-orange-800/80"} />
      <path d="M30 50 C30 35, 50 40, 50 50 C50 60, 70 65, 70 50 C70 35, 50 40, 50 50 C50 60, 30 65, 30 50 Z" 
            stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" 
            className={isDarkMode ? "text-orange-300" : "text-orange-900"} />
      <circle cx="85" cy="30" r="4" fill="currentColor" className={isDarkMode ? "text-orange-200" : "text-orange-700"} />
      <circle cx="20" cy="75" r="3" fill="currentColor" className={isDarkMode ? "text-orange-200" : "text-orange-700"} />
      <circle cx="15" cy="45" r="2" fill="currentColor" className={isDarkMode ? "text-orange-200" : "text-orange-700"} />
      <path d="M 20 75 Q 10 50 30 25" stroke="currentColor" strokeWidth="1.5" fill="none" className={isDarkMode ? "text-orange-200" : "text-orange-700"} />
    </svg>
  );

  const themeClasses = isDarkMode 
  ? "bg-[radial-gradient(ellipse_at_center,_#2a1b38,_#110b17,_#0a0a0a)] text-stone-200"
  : "bg-[radial-gradient(ellipse_at_center,_#e3c0a3,_#f4e6d9,_#faf5f0)] text-stone-900";

  const cardClasses = isDarkMode
    ? "bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer"
    : "bg-white/30 border border-white/40 backdrop-blur-md hover:bg-white/40 transition-all cursor-pointer";

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 font-['Author'] ${themeClasses}`}>
      <style dangerouslySetInnerHTML={{__html: `
        .font-satoshi { font-family: 'Satoshi', sans-serif; }
      `}} />

      <nav className={`fixed top-0 w-full z-50 backdrop-blur-lg border-b ${isDarkMode ? 'border-white/10 bg-black/20' : 'border-black/5 bg-white/20'}`}>
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="group-hover:rotate-180 transition-transform duration-700"><Logo /></div>
            <h1 className="font-satoshi font-bold text-2xl tracking-tight">Mr. Infinity's Sphere</h1>
          </Link>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            {isDarkMode ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 min-h-[90vh]">
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <header className="py-12">
            <h2 className="font-satoshi text-5xl font-bold mb-4">Exploring the endless loop of code, design, and ideas.</h2>
            <p className={`text-xl ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>Thoughts and tutorials from the center of the sphere.</p>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Architecture Article Card */}
            <Link href="/understanding-react-server-components" className="block">
              <article className={`p-8 rounded-3xl ${cardClasses} group h-full`}>
                <span className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-orange-400' : 'text-orange-700'}`}>Architecture</span>
                <h3 className="font-satoshi text-2xl font-bold mt-3 mb-2 group-hover:text-orange-500 transition-colors">Understanding React Server Components</h3>
                <p className={`mb-6 ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>A deep dive into how RSCs change the mental model of building React applications in the modern web.</p>
                <span className="text-sm opacity-70">Oct 18, 2026 • 5 min read</span>
              </article>
            </Link>
            
            {/* Design Article Card */}
            <Link href="/the-math-behind-glassmorphism" className="block">
              <article className={`p-8 rounded-3xl ${cardClasses} group h-full`}>
                <span className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-orange-400' : 'text-orange-700'}`}>Design</span>
                <h3 className="font-satoshi text-2xl font-bold mt-3 mb-2 group-hover:text-orange-500 transition-colors">The Math Behind Glassmorphism</h3>
                <p className={`mb-6 ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>Why blurring backgrounds makes UI feel premium, and how to execute it perfectly using Tailwind CSS.</p>
                <span className="text-sm opacity-70">Oct 12, 2026 • 4 min read</span>
              </article>
            </Link>
          </div>

          <div className={`mt-16 p-10 rounded-3xl text-center ${cardClasses}`}>
            <h3 className="font-satoshi text-3xl font-bold mb-4">Join the Sphere</h3>
            <p className={`mb-6 ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>Get the latest posts delivered right to your inbox. No spam, just infinity.</p>
            <form className="flex max-w-md mx-auto gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="hello@world.com" 
                className={`flex-1 px-4 py-3 rounded-xl border outline-none ${isDarkMode ? 'bg-black/40 border-white/20 text-white' : 'bg-white/60 border-black/10 text-black'}`}
              />
              <button className={`px-6 py-3 rounded-xl font-satoshi font-bold transition-transform active:scale-95 ${isDarkMode ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-stone-900 text-white hover:bg-stone-800'}`}>
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </main>

      <button 
        onClick={() => setShowFeedback(true)}
        className={`fixed bottom-8 right-8 p-4 rounded-full shadow-lg transition-transform hover:scale-105 z-40 ${isDarkMode ? 'bg-white/10 border border-white/20 backdrop-blur-md text-white' : 'bg-stone-900 text-white'}`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
      </button>

      {showFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl ${isDarkMode ? 'bg-[#1a1523] border border-white/10 text-white' : 'bg-white text-stone-900'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-satoshi text-2xl font-bold">Send Feedback</h3>
              <button onClick={() => setShowFeedback(false)} className="opacity-50 hover:opacity-100">✕</button>
            </div>
            
            {feedbackStatus === 'submitted' ? (
              <div className="py-8 text-center text-green-500 font-bold font-satoshi text-xl">
                Thanks for your thoughts!
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <textarea 
                  required
                  rows={4}
                  placeholder="What's on your mind?"
                  className={`w-full p-4 rounded-xl border outline-none resize-none ${isDarkMode ? 'bg-black/40 border-white/20 text-white placeholder-stone-500' : 'bg-stone-50 border-stone-200'}`}
                ></textarea>
                <button type="submit" className={`w-full py-3 rounded-xl font-satoshi font-bold transition-transform active:scale-95 ${isDarkMode ? 'bg-orange-500 hover:bg-orange-600' : 'bg-stone-900 text-white hover:bg-stone-800'}`}>
                  Send to the Core
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}