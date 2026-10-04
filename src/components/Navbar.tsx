'use client';

import React from 'react';
import { Flame, Sparkles, Bell, Crown } from 'lucide-react';

interface NavbarProps {
  streakDays: number;
  isPro: boolean;
  onOpenPro: () => void;
  lang: 'hi' | 'en';
  setLang: (lang: 'hi' | 'en') => void;
}

export default function Navbar({
  streakDays,
  isPro,
  onOpenPro,
  lang,
  setLang
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-gray-100 shadow-xs px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-gray-900 leading-tight flex items-center gap-1">
              Pariksha<span className="text-emerald-600">AI</span>
            </h1>
            <p className="text-[10px] text-gray-500 font-medium">Smart AI Exam Prep</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Streak Badge */}
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-full text-amber-800 text-xs font-bold shadow-2xs">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{streakDays} Days</span>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
            className="text-xs font-semibold px-2 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
            title="भाषा बदलें / Change Language"
          >
            {lang === 'hi' ? 'हिंदी' : 'ENG'}
          </button>

          {/* Pro Pass or Bell */}
          {isPro ? (
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              PRO
            </div>
          ) : (
            <button
              onClick={onOpenPro}
              className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-emerald-600 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-full shadow-sm hover:opacity-95 transition"
            >
              <Crown className="w-3 h-3" />
              <span>₹49 Pass</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
