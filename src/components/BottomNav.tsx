'use client';

import React from 'react';
import { Home, Swords, Trophy, Crown } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'home' | 'battle' | 'leaderboard' | 'pro';
  onSelectTab: (tab: 'home' | 'battle' | 'leaderboard' | 'pro') => void;
}

export default function BottomNav({ currentTab, onSelectTab }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-100 py-2 px-6 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center gap-1 transition ${
            currentTab === 'home' ? 'text-emerald-600 font-bold' : 'text-gray-400 font-medium'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* 1v1 Battle */}
        <button
          onClick={() => onSelectTab('battle')}
          className={`flex flex-col items-center gap-1 transition ${
            currentTab === 'battle' ? 'text-orange-600 font-bold' : 'text-gray-400 font-medium'
          }`}
        >
          <Swords className="w-5 h-5" />
          <span className="text-[10px]">1v1 Battle</span>
        </button>

        {/* 9 PM Live Test */}
        <button
          onClick={() => onSelectTab('leaderboard')}
          className={`flex flex-col items-center gap-1 transition ${
            currentTab === 'leaderboard' ? 'text-indigo-600 font-bold' : 'text-gray-400 font-medium'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px]">9 PM Live</span>
        </button>

        {/* Pro Pass */}
        <button
          onClick={() => onSelectTab('pro')}
          className={`flex flex-col items-center gap-1 transition ${
            currentTab === 'pro' ? 'text-amber-600 font-bold' : 'text-gray-400 font-medium'
          }`}
        >
          <Crown className="w-5 h-5" />
          <span className="text-[10px]">Pro Pass</span>
        </button>
      </div>
    </nav>
  );
}
