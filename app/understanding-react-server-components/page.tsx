"use client";
import UnderstandingRSC from "./content.mdx";
import Link from "next/link";
import React, { useState } from 'react';

export default function ArticlePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const themeClasses = isDarkMode 
  ? "bg-[radial-gradient(ellipse_at_center,_#2a1b38,_#110b17,_#0a0a0a)] text-stone-200"
  : "bg-[radial-gradient(ellipse_at_center,_#e3c0a3,_#f4e6d9,_#faf5f0)] text-stone-900";

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 font-['Author'] ${themeClasses} pt-32 pb-24`}>
      <main className="max-w-3xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <Link 
            href="/"
            className={`flex items-center gap-2 text-sm font-bold hover:-translate-x-1 transition-transform ${isDarkMode ? 'text-stone-400 hover:text-white' : 'text-stone-500 hover:text-black'}`}
          >
            ← Back to Orbit
          </Link>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-white/20 transition-colors">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <article className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <UnderstandingRSC />
        </article>
      </main>
    </div>
  );
}