'use client';

import React, { useState } from 'react';
import { Trophy, Clock, Users, X, Bell, Gift, Share2, Check } from 'lucide-react';

interface LiveTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPractice: () => void;
}

export default function LiveTestModal({
  isOpen,
  onClose,
  onStartPractice
}: LiveTestModalProps) {
  const [isReminderSet, setIsReminderSet] = useState(false);

  if (!isOpen) return null;

  const handleSetReminder = () => {
    setIsReminderSet(true);
    const text = encodeURIComponent('🔔 ParikshaAI: All-India 9 PM Live Test का रिमाइंडर सेट हो गया है! परीक्षा रात 9:00 बजे शुरू होगी: https://pariksha.nitaiitsolution.in');
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-base">All-India 9 PM Live Test</h3>
              <p className="text-[11px] text-amber-700 font-bold">राष्ट्रीय स्तर का लाइव महा-मुकाबला</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Banner */}
        <div className="my-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-4 text-white text-center shadow-md">
          <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1">
            🔴 Live Tonight at 9:00 PM
          </div>
          <h4 className="text-xl font-black">All-India Rank (AIR) टेस्ट</h4>
          <p className="text-xs text-amber-100 font-medium mt-1">
            पूरे देश के 12,450+ छात्रों के साथ अपनी असली रैंक चेक करें!
          </p>
        </div>

        {/* Details Cards */}
        <div className="space-y-2.5 mb-4 text-xs">
          <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-xl flex items-center justify-between">
            <span className="text-gray-500 font-medium">📋 आज का विषय:</span>
            <span className="font-bold text-gray-900">भारतीय इतिहास व संविधान (PYQ)</span>
          </div>
          <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-xl flex items-center justify-between">
            <span className="text-gray-500 font-medium">⏱️ टेस्ट का समय:</span>
            <span className="font-bold text-amber-700">10 मिनट (10 सवाल)</span>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-900 font-semibold">
            <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>AIR 1 से 10 को 1 महीने का Pro Pass बिल्कुल मुफ़्त!</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleSetReminder}
            className="w-full py-3.5 bg-[#25D366] text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-xs transition"
          >
            {isReminderSet ? (
              <>
                <Check className="w-4 h-4" />
                <span>✓ रिमाइंडर सेट हो गया (WhatsApp)</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 fill-white" />
                <span>🔔 8:55 PM का WhatsApp रिमाइंडर लगाएं</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onClose();
              onStartPractice();
            }}
            className="w-full py-3 bg-gray-900 text-white font-bold rounded-2xl text-xs hover:bg-black transition"
          >
            अभी प्रैक्टिस टेस्ट शुरू करें ➔
          </button>
        </div>
      </div>
    </div>
  );
}
