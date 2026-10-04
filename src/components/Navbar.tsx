'use client';

import React from 'react';
import { Flame, Sparkles, Crown, User } from 'lucide-react';
import { UserProfile } from '@/types/auth';

interface NavbarProps {
  streakDays: number;
  isPro: boolean;
  onOpenPro: () => void;
  lang: 'hi' | 'en';
  setLang: (lang: 'hi' | 'en') => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export default function Navbar({
  streakDays,
  isPro,
  onOpenPro,
  lang,
  setLang,
  currentUser,
  onOpenAuth,
  onOpenProfile
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-gray-100 shadow-xs px-4 py-2.5">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-gray-900 leading-tight flex items-center gap-1">
              Pariksha<span className="text-emerald-600">AI</span>
            </h1>
            <p className="text-[9px] text-gray-500 font-medium">Smart AI Exam Prep</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Streak Badge */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded-full text-amber-800 text-[10px] sm:text-[11px] font-bold shadow-2xs">
            <Flame className="w-3 h-3 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{streakDays}d</span>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
            className="text-[10px] sm:text-[11px] font-semibold px-1.5 py-0.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
            title="भाषा बदलें / Change Language"
          >
            {lang === 'hi' ? 'हिंदी' : 'ENG'}
          </button>

          {/* Pro Pass Badge */}
          <button
            onClick={onOpenPro}
            className="flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs hover:opacity-95 transition"
            title="30-Day Free Pro Pass Active!"
          >
            <Crown className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
            <span>PRO</span>
          </button>

          {/* Auth Button or User Avatar */}
          {currentUser ? (
            <button
              onClick={onOpenProfile}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-indigo-600 text-white font-black text-[11px] sm:text-xs flex items-center justify-center shadow-xs hover:scale-105 transition shrink-0"
              title={`${currentUser.name} (प्रोफाइल देखें)`}
            >
              {currentUser.name.charAt(0).toUpperCase()}
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs transition"
            >
              <User className="w-3 h-3" />
              <span>लॉगिन</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
